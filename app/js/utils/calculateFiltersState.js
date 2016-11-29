import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { ASSET_CLASS_TREE } from '../constants/static-data'
import { FILTER_TYPE_ASSET_CLASS_TREE, POD_CATEGORY, RISK_PROFILE } from '../constants/filters'
import { CHECKED, VALUE } from '../constants/global'

const setAssetClassLevel2Deep = ({ ASSET_CLASS_TREE, level1, level2, checked }) =>
    Immutable.Map({
        value: ASSET_CLASS_TREE[level1][level2].reduce((accLevel3, level3) => {
            return accLevel3.set(level3, checked) // checked level 3
        }, Immutable.Map()),
        checked // checked level 2
    })

const setAssetClassLevel1Deep = ({ ASSET_CLASS_TREE, level1, checked }) =>
    Immutable.Map({
        value: Object.keys(ASSET_CLASS_TREE[level1]).reduce((accLevel2, level2) =>
                accLevel2.set(level2, setAssetClassLevel2Deep({ ASSET_CLASS_TREE, level1, level2, checked }))
            , Immutable.Map()),
        checked // checked level 1
    })

const reduceAssetClassTree = ASSET_CLASS_TREE =>
    Object.keys(ASSET_CLASS_TREE).reduce((accLevel1, level1) =>
            accLevel1.set(level1, setAssetClassLevel1Deep({ ASSET_CLASS_TREE, level1, [CHECKED]: false }))
        , Immutable.Map()
    )

export const riskProfileInitialState = Immutable.Map({})

export const assetClassTreeInitialState = reduceAssetClassTree(ASSET_CLASS_TREE)

export const podCategoryInitialState = Immutable.Map({})

export const calculateRiskProfileFilter = ({ state, riskProfile, checked }) =>
    state.setIn([RISK_PROFILE, riskProfile], checked)

export const calculatePodCategoryFilter = ({ state, podCategory }) => {
    const newPodCategory = podCategory.reduce((acc, { value }) => {
        acc = acc.set(value, true)

        return acc
    }, Immutable.Map())

    return state.set(POD_CATEGORY, newPodCategory)
}

export const calculateAssetClassificationLevel1Filter = ({ state, assetClassificationLevel1, checked }) =>
    state.setIn(
        [FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1],
        setAssetClassLevel1Deep({ ASSET_CLASS_TREE, level1: assetClassificationLevel1, checked })
    )

export const calculateAssetClassificationLevel2Filter =
    ({ state, assetClassificationLevel1, assetClassificationLevel2, checked }) => {
        state = state.setIn(
            [FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, VALUE, assetClassificationLevel2],
            setAssetClassLevel2Deep({
                ASSET_CLASS_TREE,
                level1: assetClassificationLevel1,
                level2: assetClassificationLevel2,
                checked
            })
        )
        if (checked) {
            state = state.setIn([FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, CHECKED], checked)
        } else {
            const isLevel1Checked = state
                .getIn([FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, VALUE])
                .some(level2 => level2.get(CHECKED) === true)

            state = state.setIn(
                [FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, CHECKED],
                isLevel1Checked
            )
        }

        return state
    }

export const calculateAssetClassificationLevel3Filter =
    ({ state, assetClassificationLevel1, assetClassificationLevel2, assetClassificationLevel3, checked }) => {
        state = state.setIn(
            [
                FILTER_TYPE_ASSET_CLASS_TREE,
                assetClassificationLevel1,
                VALUE,
                assetClassificationLevel2,
                VALUE,
                assetClassificationLevel3
            ],
            checked
        )
        if (checked) {
            state = state.setIn([FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, CHECKED], checked)
            state = state.setIn(
                [
                    FILTER_TYPE_ASSET_CLASS_TREE,
                    assetClassificationLevel1,
                    VALUE,
                    assetClassificationLevel2,
                    CHECKED
                ],
                checked
            )
        } else {
            const isLevel2Checked = state
                .getIn([
                    FILTER_TYPE_ASSET_CLASS_TREE,
                    assetClassificationLevel1,
                    VALUE,
                    assetClassificationLevel2,
                    VALUE
                ])
                .some(level3 => level3 === true)

            state = state.setIn(
                [
                    FILTER_TYPE_ASSET_CLASS_TREE,
                    assetClassificationLevel1,
                    VALUE,
                    assetClassificationLevel2,
                    CHECKED
                ],
                isLevel2Checked
            )

            const isLevel1Checked = state
                .getIn([FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, VALUE])
                .some(level2 => level2.get(CHECKED) === true)

            state = state.setIn(
                [FILTER_TYPE_ASSET_CLASS_TREE, assetClassificationLevel1, CHECKED],
                isLevel1Checked
            )
        }

        return state
    }

export const calculateAssetClassificationFilter =
    ({ state, assetClassificationLevel1, assetClassificationLevel2, assetClassificationLevel3, checked }) => {
        if (assetClassificationLevel1 !== undefined && assetClassificationLevel2 === undefined) {
            state = calculateAssetClassificationLevel1Filter({ state, assetClassificationLevel1, checked })
        }
        if (assetClassificationLevel2 !== undefined && assetClassificationLevel3 === undefined) {
            state = calculateAssetClassificationLevel2Filter({
                state,
                assetClassificationLevel1,
                assetClassificationLevel2,
                checked
            })
        }
        if (assetClassificationLevel3 !== undefined) {
            state = calculateAssetClassificationLevel3Filter({
                state,
                assetClassificationLevel1,
                assetClassificationLevel2,
                assetClassificationLevel3,
                checked
            })
        }

        return state
    }

export const hasRiskProfileFiltersSelector = createSelector(
    state => state.get(RISK_PROFILE),
    riskProfileFilters => riskProfileFilters.some(filter => filter === true)
)

export const hasPodCategoryFiltersSelector = createSelector(
    state => state.get(POD_CATEGORY),
    podCategoryFilters => podCategoryFilters.some(filter => filter === true)
)

export const hasAssetClassificationsFiltersSelector = createSelector(
    state => state.get(FILTER_TYPE_ASSET_CLASS_TREE),
    assetClassTreeFilters => assetClassTreeFilters.some(assetClass => assetClass.get(CHECKED))
)
