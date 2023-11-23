/**
 * @module
 * @hidden
 */
import { main } from "data/projEntry";
import { createCumulativeConversion } from "features/conversion";
import { jsx } from "features/feature";
import { createHotkey } from "features/hotkey";
import { createReset } from "features/reset";
import MainDisplay from "features/resources/MainDisplay.vue";
import { createResource } from "features/resources/resource";
import { addTooltip } from "features/tooltips/tooltip";
import { createResourceTooltip } from "features/trees/tree";
import { BaseLayer, createLayer } from "game/layers";
import type { DecimalSource } from "util/bignum";
import { render } from "util/vue";
import { createLayerTreeNode, createResetButton } from "../common";
import { Upgrade, createUpgrade } from "features/upgrades/upgrade";
import { noPersist } from "game/persistence";
import { CostRequirement, createCostRequirement } from "game/requirements";
import { Computable } from "util/computed";
import { computed } from "@vue/reactivity";
import Decimal from "util/bignum";

const id = "d";
const layer = createLayer(id, function (this: BaseLayer) {
    const name = "Divinity";
    const color = "#BA2B2B";
    const points = createResource<DecimalSource>(0, "divinity");

    const conversion = createCumulativeConversion(() => ({
        formula: x => x.div(10).sqrt(),
        baseResource: main.points,
        gainResource: points
    }));

    const reset = createReset(() => ({
        thingsToReset: (): Record<string, unknown>[] => [layer]
    }));

    const upgradeEffects = {
        0: computed(() => {
            let ret = new Decimal(1);
            // if modifiers to this come later, add more here
            return ret;
        })
    }

    const upgradesRow1: Array<Upgrade<{
        requirements: CostRequirement;
        display: Computable<any>;
    }>> = [
        createUpgrade(() => ({
            requirements: createCostRequirement(() => ({
                resource: noPersist(points),
                cost: 1
            })),
            display: {
                title: "Absorbing points",
                description: "Absorb 1 point every second from your surroundings"
            }
        }))
    ];

    const treeNode = createLayerTreeNode(() => ({
        layerID: id,
        color,
        reset
    }));

    const tooltip = addTooltip(treeNode, {
        display: createResourceTooltip(points),
        pinnable: true
    });

    const resetButton = createResetButton(() => ({
        conversion,
        tree: main.tree,
        treeNode
    }));

    const hotkey = createHotkey(() => ({
        description: "Reset for divinity",
        key: "d",
        onPress: resetButton.onClick
    }));

    return {
        name,
        color,
        points,
        tooltip,
        display: jsx(() => (
            <>
                <MainDisplay resource={points} color={color} />
                {render(resetButton)}
                <br/>
                <br/>
                <table>
                    <tbody>
                        <tr>
                            {upgradesRow1.map(upg => (
                                <td>{render(upg)}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </>
        )),
        treeNode,
        upgradesRow1,
        upgradeEffects,
        hotkey
    };
});

export default layer;
