# sumerian scene loader


THIS SCRIPT IS HIGHLY EXPERIMENTAL.
THE AUTHOR PROVIDES NO GUARENTEES THAT THE SCRIPT WORKS, LET ALONE WILL CONTINUE TO WORK AS SUMERIAN EVOLVES


# Build and deploy

This is a rollup package meant to support writing Sumerian script code outside of the Sumerian editor

* The rollup build is configured to add the module exports to the window object so they can be used from Sumerian script components
* The rollup build also has a S3 uploader. Just set the normal AWS credentials environment variables, as well as S3_BUCKET and S3_PREFIX, and the built bundles will be uploaded to S3. You can load these scripts in Sumerian by placing their URLs in the script component references section
* This is primiarly meant as a deployment tool. It is recommended to place a cloudfront deployment infront of the bucket to ensure the best performance and edge caching


# Dynamic Scene Loader

This library contains some simple classes to hook up dynamic loading into Sumerian. By using this script in the top-level scene opened by your customers, you may load and manipulate entities from other scenes you own dynamically at runtime.

The general flow is as follows
* Create your top-level scene. This is the scene users will be linked to or will otherwise see first.
* Setup your Cognito pool as normal in Sumerian in the top-level scene. Ensure it has permissions to 'sumerian:ViewRelease' for any projects you will be dynamically loading. 
* Create one or more scenes with assets you'd like to load dynamically. Ensure the entities appear in the scene graph of these scenes and not just in the asset bin
* For every dynamically loaded scene, in the Publish menu, select 'Host Privately' and click Publish. Copy the JSON blob that is created, we will use it later
* In the top-level scene, create a SceneLoader in a setup() script like the following:

```
SystemBus.addListener(AwsSystem.SDK_READY, ()=>{
    ctx.worldData.loader = new window.sumerian_helpers.SceneLoader("us-west-2", sumerian, ctx.world, AWS.config.credentials);
}, true);

```

Now, anywhere in your code you may download the data for a scene like so:
```
// The following json blob is from the Sumerian editor when publishing above
const config = {
    url: URL,
    sceneId: sceneId
}
// This first line will download all the data in the given scene
ctx.worldData.loader.loadRelease(config).then(async (loader) => {
    //This loader object can load any object in the loaded scene
    // For example, you may load a material, and add the material dynamically to an existing entity
    // In this case, we are loading an entire entity
    // This loader is the DynamicLoader type from the Scripting API
    const entity = await loader.load("bf89149335b044e4b3cef634d0ba9e5f.entity");
    // When loading an entity, be sure to call addToWorld so it is added to the world and started
    entity.addToWorld();
});
```

* In the `cleanup()` function of the script that created the SceneLoader, you must run the following code

`ctx.worldData.loader.cleanup()`

Otherwise, any entities loaded will not be removed upon pressing stop in the editor

