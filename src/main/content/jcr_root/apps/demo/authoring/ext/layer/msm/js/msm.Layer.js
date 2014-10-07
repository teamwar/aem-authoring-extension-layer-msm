/*
 * #%L
 * Adobe AEM6 demo for authoring extension point: MSM Layer
 * %%
 * Copyright (C) 2014 Adobe
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
(function ($, author, msm, channel, window, undefined) {

    var name = Granite.I18n.get('Live Copy Status'), // public layer name
        iconClass = 'coral-Icon--link'; // icon to be shown in the layer switcher

    /**
     * 
     * @constructor
     */
    var MsmLayer = function () {
        // Call super constructor
        this.constructor.prototype.constructor.call(this, name, iconClass);
    };

    // set generic layer as prototype for inheritance
    MsmLayer.prototype = new author.Layer();

    /**
     * Determines if the layer is available for the current page
     * 
     * MSM layer: If the page is not a life copy then this layer is deactivated
     * 
     * @return {Boolean}
     */
    MsmLayer.prototype.isAvailable = function() {
        return author.page && 
            author.page.info && 
            author.page.info.msm && 
            author.page.info.msm['msm:isLiveCopy'] === true;
    };

    /**
     * Will be called when the layer gets activated
     */
    MsmLayer.prototype.setUp = function () {
        // find all current editables on the page
        author.store.set(author.edit.findEditables());

        // activate the custom MSM overlay
        author.overlayManager.setOverlayRendering(msm.Overlay);
        author.overlayManager.setup();
        author.overlayManager.reposition(true);

        // Show after the overlays are initially positioned
        setTimeout(function () {
            author.overlayManager.startObservation();
            author.overlayManager.setVisible(true);
        }, 300);
    };

    /**
     * Will be called when the layer gets deactivated
     */
    MsmLayer.prototype.tearDown = function () {
        // Clean the overlays
        author.overlayManager.stopObservation();
        author.overlayManager.teardown();
        author.overlayManager.resetOverlayRendering();
        author.overlayManager.setVisible(false);

        author.store.clean();
    };

    // register at the manager
    author.layerManager.registerLayer(new MsmLayer());

    // expose to namespace (in case to provide further inheritance)
    msm.Layer = MsmLayer;

}(jQuery, Granite.author, adobe.demo.ext.msm, jQuery(document), this));
