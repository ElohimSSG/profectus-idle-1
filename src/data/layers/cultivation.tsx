/**
 * @module
 * @hidden
 */

import MainDisplay from "features/resources/MainDisplay.vue";
import { Visibility, jsx } from "features/feature";
import { createResource } from "features/resources/resource";
import { BaseLayer, createLayer } from "game/layers";
import { DecimalSource } from "lib/break_eternity";
import { createLayerTreeNode } from "data/common";
import { addTooltip } from "features/tooltips/tooltip";
import { createResourceTooltip } from "features/trees/tree";
import divinity from "./divinity"

const id = "c";
const layer = createLayer(id, function (this: BaseLayer) {
    const name = "Cultivation";
    const color = "#BA2B2B";
    const points = createResource<DecimalSource>(0, "Cultivation Points");

    const treeNode = createLayerTreeNode(() => ({
        visibility: () => 
            divinity.cultivationPoint.bought.value ? Visibility.Visible : Visibility.Hidden,
        layerID: id,
        color
    }));

    const tooltip = addTooltip(treeNode, {
        display: createResourceTooltip(points),
        pinnable: true,
        style: () => (treeNode.visibility.value === Visibility.Visible ? "" : "display: none")
    });

    // Skilltree Nodes



    // Return

    return {
        name, 
        color,
        points,
        tooltip,
        display: jsx(() => (
            <>
                <MainDisplay resource={points} color={color} />
            </>
        )),
        treeNode
    }
});

export default layer;