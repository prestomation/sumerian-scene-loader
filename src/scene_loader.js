/* global window */
export class LoaderFactory {

    constructor(region, sumerian, world) {
        
        this._sumerian = sumerian;
        this._world = world;
        this._region = region;
    }
    
    async getLoader(sceneId) {
        const url= `https://${this._region}.sumerian.amazonaws.com/api/projects/abc/resources/${sceneId}/publish`;
        
		const res = await window.fetch(url);
		const json = await res.json();
		const bundleRequestData = json.bundleData;
		const binaryRequestData = json.binaryRequestData;

		const authorizationRequestData = Object.assign({}, bundleRequestData, binaryRequestData);
       	const options = {
				binaryRequestData : authorizationRequestData
		};
		const ajax = new this._sumerian.Ajax('', options);
        
       	return new this._sumerian.DynamicLoader({world : this._world, ajax});
    }

}
