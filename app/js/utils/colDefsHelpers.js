import Immutable from 'immutable'
import { DataCell, VehicleWithDeleteHeaderCell } from '../components/AgGrid'
import { ASSET_CLASS_LEVEL_1 } from '../constants/static-data'
import { headerCellRenderer } from '../components/Root'

const VEHICLE_HEADER_COLUMN_WIDTH = 30
const POD_CATEGORY_COLUMN_WIDTH = 210

export const getFirstExpandedAssetClassification = vehiclesColDefsByAssetClassification =>
    ASSET_CLASS_LEVEL_1.find(acLvl1 => vehiclesColDefsByAssetClassification.get(acLvl1) !== undefined)

export const getFirstExpandedPodCategory =
    (vehiclesColDefsByAssetClassificationAndThenByPodCategory, acLvl1OpenByDefault) =>
        vehiclesColDefsByAssetClassificationAndThenByPodCategory
                .get(acLvl1OpenByDefault)
                .findKey(first => true)

const mapVehiclesColumnDefinitionsToNestedChildrenHeaderColumns = (vehiclesDefinitions, acLvl1) => {
    if (vehiclesDefinitions.length * 30 < POD_CATEGORY_COLUMN_WIDTH) {
        return [
            ...vehiclesDefinitions,
            {
                headerName: '',
                width: POD_CATEGORY_COLUMN_WIDTH - vehiclesDefinitions.length * VEHICLE_HEADER_COLUMN_WIDTH,
                minWidth: VEHICLE_HEADER_COLUMN_WIDTH,
                columnGroupShow: 'open',
                cellClass: acLvl1.split(' ')[0],
                suppressMenu: true,
                suppressSorting: true,
                suppressFilter: true,
                suppressResize: true
            }
        ]
    } else {
        return [...vehiclesDefinitions]
    }
}

export const genericColDefsByAssetClassificationAndThenByPodCategory =
    (vehiclesColDefsByAssetClassificationAndThenByPodCategory, assetClassification, acLvl1OpenByDefault,
     podCategoryOpenByDefault) => {
        if (vehiclesColDefsByAssetClassificationAndThenByPodCategory.get(assetClassification) !== undefined) {
            const podCategories =
                Object.keys(vehiclesColDefsByAssetClassificationAndThenByPodCategory.get(assetClassification).toJS())

            return {
                headerName: assetClassification,
                width: POD_CATEGORY_COLUMN_WIDTH,
                minWidth: POD_CATEGORY_COLUMN_WIDTH,
                marryChildren: true,
                headerClass: ({ columnGroup }) => {
                    const isExpanded = columnGroup.isExpanded()

                    if (isExpanded) {
                        return 'header-expanded'
                    } else {
                        return null
                    }
                },
                openByDefault: assetClassification === acLvl1OpenByDefault,
                children: [
                    {
                        headerName: '',
                        width: POD_CATEGORY_COLUMN_WIDTH,
                        minWidth: POD_CATEGORY_COLUMN_WIDTH,
                        columnGroupShow: 'closed',
                        cellClass: assetClassification.split(' ')[0],
                        suppressMenu: true,
                        suppressSorting: true,
                        suppressFilter: true,
                        suppressResize: true,
                        suppressSizeToFit: true
                    },
                    ...podCategories.map(category => ({
                        headerName: category,
                        headerClass: ({ columnGroup }) => {
                            const isExpanded = columnGroup.isExpanded()

                            if (isExpanded) {
                                return 'header-expanded'
                            } else {
                                return null
                            }
                        },
                        columnGroupShow: 'open',
                        width: POD_CATEGORY_COLUMN_WIDTH,
                        minWidth: POD_CATEGORY_COLUMN_WIDTH,
                        suppressMenu: true,
                        suppressSorting: true,
                        suppressFilter: true,
                        suppressResize: true,
                        marryChildren: true,
                        suppressSizeToFit: true,
                        openByDefault: category === podCategoryOpenByDefault,
                        children: [
                            {
                                headerName: '',
                                width: POD_CATEGORY_COLUMN_WIDTH,
                                minWidth: POD_CATEGORY_COLUMN_WIDTH,
                                columnGroupShow: 'closed',
                                cellClass: assetClassification.split(' ')[0],
                                suppressMenu: true,
                                suppressSorting: true,
                                suppressFilter: true,
                                suppressResize: true,
                                suppressSizeToFit: true
                            },
                            ...mapVehiclesColumnDefinitionsToNestedChildrenHeaderColumns(
                                vehiclesColDefsByAssetClassificationAndThenByPodCategory
                                        .getIn([assetClassification, category]).toJS(),
                                assetClassification
                            )
                        ]
                    }))
                ]
            }
        } else {
            return {
                headerName: assetClassification,
                hide: true
            }
        }
    }

export const genericColDefsByAssetClassification =
    ({ vehiclesColDefsByAssetClassification, acLvl1, acLvl1OpenByDefault }) => {
        if (vehiclesColDefsByAssetClassification.get(acLvl1) !== undefined) {
            return {
                headerName: acLvl1,
                width: POD_CATEGORY_COLUMN_WIDTH,
                minWidth: POD_CATEGORY_COLUMN_WIDTH,
                marryChildren: true,
                headerClass: ({ columnGroup }) => {
                    const isExpanded = columnGroup.isExpanded()

                    if (isExpanded) {
                        return 'header-expanded'
                    } else {
                        return null
                    }
                },
                openByDefault: acLvl1 === acLvl1OpenByDefault,
                children: [
                    {
                        headerName: '',
                        width: POD_CATEGORY_COLUMN_WIDTH,
                        minWidth: POD_CATEGORY_COLUMN_WIDTH,
                        columnGroupShow: 'closed',
                        cellClass: acLvl1.split(' ')[0],
                        suppressMenu: true,
                        suppressSorting: true,
                        suppressFilter: true,
                        suppressResize: true,
                        suppressSizeToFit: true
                    },
                    ...mapVehiclesColumnDefinitionsToNestedChildrenHeaderColumns(
                        vehiclesColDefsByAssetClassification.get(acLvl1).toJS(),
                        acLvl1
                    )
                ]
            }
        } else {
            return {
                headerName: acLvl1,
                hide: true
            }
        }
    }

export const mapVehicleToColDef = ({ editable }) => (vehicle, acLvl1) => ({
    headerName: typeof vehicle === 'string' ? vehicle : vehicle.ticker,
    width: VEHICLE_HEADER_COLUMN_WIDTH,
    minWidth: VEHICLE_HEADER_COLUMN_WIDTH,
    field: typeof vehicle === 'string' ? vehicle : vehicle.ticker,
    editable,
    cellRendererFramework: DataCell,
    columnGroupShow: 'open',
    suppressMenu: true,
    suppressSorting: true,
    suppressFilter: true,
    suppressResize: true,
    headerClass: 'vehicle-header',
    cellClass: `vehicle-cell ${acLvl1 ? acLvl1.split(' ')[0] : ''}`,
    [editable ? 'headerCellTemplate' : '']: headerCellRenderer(VehicleWithDeleteHeaderCell)
})

export const flattenVehicles = ({ data, acLvl1 }) => {
    let vehicles = Immutable.OrderedSet()

    data.forEach(vehicleHolder => {
        vehicleHolder.vehicles.forEach(({ ticker, assetClassification: { level1 } }) => {
            if (acLvl1 === undefined) {
                vehicles = vehicles.add(ticker)
            } else if (acLvl1 === level1) {
                vehicles = vehicles.add(ticker)
            }
        })
    })

    return vehicles
}

export const groupByAssetClassLevel1 = ({ data }) =>
    ASSET_CLASS_LEVEL_1.reduce((acc, acLvl1) => {
        data.forEach(vehicleHolder => {
            if (vehicleHolder.assetClassificationLevel1 === acLvl1) {
                if (acc.get(acLvl1) === undefined) {
                    acc = acc.set(acLvl1, Immutable.List())
                }

                acc = acc.set(acLvl1, acc.get(acLvl1).push(vehicleHolder))
            }
        })

        return acc
    }, Immutable.Map({}))

export const groupVehiclesByAssetClassLevel1AndMapThemToColDefs = ({ data, editable }) => {
    const mapVehilces = mapVehicleToColDef({ editable })

    return ASSET_CLASS_LEVEL_1.reduce((acc, acLvl1) => {
        data.forEach(vehicleHolder =>
            vehicleHolder.vehicles.forEach(vehicle => {
                if (vehicle.assetClassification.level1 === acLvl1) {
                    if (acc.get(acLvl1) === undefined) {
                        acc = acc.set(acLvl1, Immutable.List())
                    }

                    // if acLvl1 does not already have this ticker
                    if (!acc.get(acLvl1).find(vehicleFromAcc => vehicleFromAcc.ticker === vehicle.ticker)) {
                        acc = acc.set(acLvl1, acc.get(acLvl1).push(mapVehilces(vehicle, acLvl1)))
                    }
                }
            }))

        return acc
    }, Immutable.Map({}))
}

export const groupVehiclesByAssetClassificationAndThenByCategory = pods =>
    pods.reduce((acc, pod) => {
        let newAcc = []

        if (pod.vehicles) {
            pod.vehicles.forEach(vehicle => {
                newAcc.push(vehicle.ticker)
            })

            return acc.setIn(
                [pod.assetClassificationLevel1, pod.category],
                acc.getIn([pod.assetClassificationLevel1, pod.category])
                    ? acc.getIn([pod.assetClassificationLevel1, pod.category]).union(newAcc)
                    : Immutable.OrderedSet(newAcc)
            )
        } else {
            return acc
        }
    }, Immutable.Map({}))

export const flattenVehiclesAndMapThemToColDefsWithAcLvl1ClassNames = ({ data, editable }) => {
    const mapVehicle = mapVehicleToColDef({ editable })

    const dataByAssetClassLevel1 = groupByAssetClassLevel1({ data })

    return dataByAssetClassLevel1
            .map((data, acLvl1) => {
                const vehicles = flattenVehicles({ data, acLvl1 })

                return vehicles.map(vehicle => mapVehicle(vehicle, acLvl1))
            })
            .reduce((acc, vehiclesColDefsByAcLvl1) => {
                acc = acc.union(vehiclesColDefsByAcLvl1)

                return acc
            }, Immutable.OrderedSet())
}
