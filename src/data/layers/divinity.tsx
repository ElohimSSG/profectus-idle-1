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
import { RepeatableDisplay } from "features/repeatable";
import { Repeatable } from "features/repeatable";
import { Resource } from "@pixi/core";
import { createRepeatable } from "features/repeatable";
import { formatWhole } from "util/break_eternity";

const id = "d";
const layer = createLayer(id, function (this: BaseLayer) {
    const name = "Divinity";
    const color = "#AE2B3D";
    const points = createResource<DecimalSource>(0, "divinity");

    const conversion = createCumulativeConversion(() => ({
        formula: x => x.div(10).sqrt(),
        baseResource: main.points,
        gainResource: points
    }));

    const reset = createReset(() => ({
        thingsToReset: (): Record<string, unknown>[] => [layer]
    }));

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

    // Upgrades and Stuff:

    // Buyables
    // Later the formula will look like this:
    // Decimal.add(buyables[0].amount.value, extraBuyableLevels[0].value).times(buyablePower.value)

    const repeatableEffects = {
        0: computed(() => 
            Decimal.times(repeatables[0].amount.value, upgradeEffects[0].value)
        )
    }

    const repeatables: Array<
        Repeatable<{
            requirements: CostRequirement;
            display: Computable<RepeatableDisplay>;
        }>
    > = [
        createRepeatable(() => ({
            requirements: createCostRequirement(() => ({
                resource: noPersist(points),
                cost: 1
            })),
            display: () => ({
                title: "Absorbing",
                description: "Start getting crumbs",
                effectDisplay: "+" + formatWhole(repeatableEffects[0].value)
            })
        }))
    ]

    // Upgrades
    
    const upgradeEffects = {
        0: computed(() => {
            let ret = new Decimal(2);

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
                cost: 5
            })),
            display: {
                title: "Faster Absorbing",
                description: "Double the points gained by Absorbing"
            }
        }))
    ];
    
    const cultivationPoint = createUpgrade(() => ({
        requirements: createCostRequirement(() => ({
            resource: noPersist(points),
            cost: new Decimal("1e1e3")
        })),
        display: {
            title: "Cultivation Point",
            description: "Master Divinity and get 1 Cultivation Point"
        }
    }))

    // Return

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
                            {repeatables.map(upg => (
                                <td>{render(upg)}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
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
                <br/>
                <br/>
                {render(cultivationPoint)}
            </>
        )),
        hotkey,
        treeNode,
        repeatableEffects,
        repeatables,
        upgradesRow1,
        upgradeEffects,
        cultivationPoint
    };
});

export default layer;
