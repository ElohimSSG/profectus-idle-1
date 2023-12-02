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
import { format, formatWhole } from "util/break_eternity";
import { globalBus } from "game/events";

const id = "d";
const layer = createLayer(id, function (this: BaseLayer) {
    const name = "Divinity";
    const color = "#AE2B3D";
    const points = createResource<DecimalSource>(0, "divinity");

    const repeatableCostDiv = computed(() => {
        let div = Decimal.dOne;
        // cost reducers here with 
        // div = div.times(reducer)
        return div;
    });

    const repeatableCostExp = computed(() => {
        let exp = Decimal.dOne;
        // exponents go here e.g. challenges
        return exp;
    });

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

    const repeatableEffects: any = {
        0: computed(() => {
            let ret = repeatables[0].amount.value
            let multipliers = repeatableEffects[1].value
            if (upgrades[0][0].bought.value) Decimal.add(multipliers, upgradeEffects[0].value)
            return Decimal.pow(Decimal.times(ret, multipliers), repeatableEffects[2].value);
        }),
        1: computed(() =>
            Decimal.add(1, Decimal.times(0.25, repeatables[1].amount.value))
        ),
        2: computed(() =>
            Decimal.add(1, Decimal.times(0.01, repeatables[2].amount.value))
        )
    }

    globalBus.on("update", diff => {
        if (upgrades[1][0].bought.value) points.value = Decimal.plus(points.value, conversion.currentGain.value);
    });

    const repeatables: Array<
        Repeatable<{
            requirements: CostRequirement;
            display: Computable<RepeatableDisplay>;
        }>
    > = [
            createRepeatable(() => ({
                requirements: createCostRequirement(() => ({
                    resource: noPersist(points),
                    cost() {
                        let aof = repeatables[0].amount.value;
                        let ret = Decimal.floor(Decimal.pow(3, Decimal.root(aof, 2.2)).div(repeatableCostDiv.value).pow(repeatableCostExp.value));
                        return ret;
                    }
                })),
                display: () => ({
                    title: "Absorbing",
                    description: "Start getting crumbs",
                    effectDisplay: "+" + formatWhole(repeatableEffects[0].value)
                })
            })),
            createRepeatable(() => ({
                requirements: createCostRequirement(() => ({
                    resource: noPersist(points),
                    cost() {
                        let aof = Decimal.add(repeatables[1].amount.value, 1);
                        let ret = Decimal.floor(Decimal.pow(5, Decimal.root(aof, 2.2)).div(repeatableCostDiv.value).pow(repeatableCostExp.value));
                        return ret;
                    }
                })),
                display: () => ({
                    title: "Strengthening",
                    description: "Increase your crumb gain",
                    effectDisplay: "x" + format(repeatableEffects[1].value)
                })
            })),
            createRepeatable(() => ({
                requirements: createCostRequirement(() => ({
                    resource: noPersist(points),
                    cost() {
                        let aof = Decimal.add(repeatables[2].amount.value, 1);
                        let ret = Decimal.floor(Decimal.pow(10, Decimal.root(aof, 1.7)).div(repeatableCostDiv.value).pow(repeatableCostExp.value));
                        return ret;
                    }
                })),
                display: () => ({
                    title: "Exponentialism",
                    description: "Increase your crumb gain, but exponantially",
                    effectDisplay: "^" + format(repeatableEffects[2].value)
                })
            }))
        ]

    // Upgrades

    const upgradeEffects = {
        0: computed(() => {
            let ret = new Decimal(2);

            return ret;
        }),
        1: computed(() => {
            return Decimal.add(1, Decimal.times(0.1, Decimal.root(points.value, 2)))
        })
    }

    /**
     * Array of Arrays
     * each array should contain 3 upgrades (maybe i'll realize later that more looks better)
     */
    const upgrades: Array<Array<Upgrade<{
        requirements: CostRequirement;
        display: Computable<any>;
    }>>> = [[
        createUpgrade(() => ({
            requirements: createCostRequirement(() => ({
                resource: noPersist(points),
                cost: 100
            })),
            display: {
                title: "Faster Absorbing",
                description: "Double the points gained by Absorbing",
                effectDisplay: "x" + formatWhole(upgradeEffects[0].value)
            }
        })),
        createUpgrade(() => ({
            requirements: createCostRequirement(() => ({
                resource: noPersist(points),
                cost: 250
            })),
            display: {
                title: "Crumb Divinity Feedback",
                description: "Increase your Crumb Gain by current Divinity",
                effectDisplay: "x" + format(upgradeEffects[1].value)
            }
        }))
    ],
    [
        createUpgrade(() => ({
            requirements: createCostRequirement(() => ({
                resource: noPersist(points),
                cost: 1e10
            })),
            display: {
                title: "Auto Divinity",
                description: "Automatically get your Divinity on reset per second"
            }
        }))
    ]];

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
                <br />
                <table>
                    <tbody>
                        <tr>
                            {repeatables.map(upg => (
                                <td>{render(upg)}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <br />
                <table>
                    <tbody>
                        {upgrades.map(upgRow => (
                            <tr>
                                {upgRow.map(upg => (
                                    <td>{render(upg)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                {render(cultivationPoint)}
            </>
        )),
        hotkey,
        treeNode,
        repeatableEffects,
        repeatables,
        upgrades,
        upgradeEffects,
        cultivationPoint
    };
});

export default layer;
