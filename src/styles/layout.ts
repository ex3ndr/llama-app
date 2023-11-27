import { DimensionValue, FlexAlignType, StyleProp, StyleSheet, ViewStyle } from "react-native";

export type LayoutExternalStyleProps = {

    // Flex
    alignSelf?: 'auto' | FlexAlignType | undefined;
    flex?: number | undefined;
    flexBasis?: DimensionValue | undefined;
    flexGrow?: number | undefined;
    flexShrink?: number | undefined;

    // Dimensions
    height?: DimensionValue | undefined;
    width?: DimensionValue | undefined;

    // Margins
    margin?: DimensionValue | undefined;
    marginBottom?: DimensionValue | undefined;
    marginEnd?: DimensionValue | undefined;
    marginHorizontal?: DimensionValue | undefined;
    marginLeft?: DimensionValue | undefined;
    marginRight?: DimensionValue | undefined;
    marginStart?: DimensionValue | undefined;
    marginTop?: DimensionValue | undefined;
    marginVertical?: DimensionValue | undefined;

    // Z Index
    zIndex?: number | undefined;
}

export function extractExternalLayoutStyle(src: StyleProp<ViewStyle>) {
    let flatten = StyleSheet.flatten(src);
    let res: LayoutExternalStyleProps = {};
    if (flatten.alignSelf !== undefined) res.alignSelf = flatten.alignSelf;
    if (flatten.flex !== undefined) res.flex = flatten.flex;
    if (flatten.flexBasis !== undefined) res.flexBasis = flatten.flexBasis;
    if (flatten.flexGrow !== undefined) res.flexGrow = flatten.flexGrow;
    if (flatten.flexShrink !== undefined) res.flexShrink = flatten.flexShrink;
    if (flatten.height !== undefined) res.height = flatten.height;
    if (flatten.width !== undefined) res.width = flatten.width;
    if (flatten.margin !== undefined) res.margin = flatten.margin;
    if (flatten.marginBottom !== undefined) res.marginBottom = flatten.marginBottom;
    if (flatten.marginEnd !== undefined) res.marginEnd = flatten.marginEnd;
    if (flatten.marginHorizontal !== undefined) res.marginHorizontal = flatten.marginHorizontal;
    if (flatten.marginLeft !== undefined) res.marginLeft = flatten.marginLeft;
    if (flatten.marginRight !== undefined) res.marginRight = flatten.marginRight;
    if (flatten.marginStart !== undefined) res.marginStart = flatten.marginStart;
    if (flatten.marginTop !== undefined) res.marginTop = flatten.marginTop;
    if (flatten.marginVertical !== undefined) res.marginVertical = flatten.marginVertical;
    if (flatten.zIndex !== undefined) res.zIndex = flatten.zIndex;
    return res;
}

export type LayoutInternalStyleProps = {

    // Flex
    flexDirection?:
    | 'row'
    | 'column'
    | 'row-reverse'
    | 'column-reverse'
    | undefined;
    rowGap?: number | undefined;
    gap?: number | undefined;
    columnGap?: number | undefined;
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse' | undefined;
    justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
    alignItems?: FlexAlignType | undefined;

    // Paddings
    padding?: DimensionValue | undefined;
    paddingBottom?: DimensionValue | undefined;
    paddingEnd?: DimensionValue | undefined;
    paddingHorizontal?: DimensionValue | undefined;
    paddingLeft?: DimensionValue | undefined;
    paddingRight?: DimensionValue | undefined;
    paddingStart?: DimensionValue | undefined;
    paddingTop?: DimensionValue | undefined;
    paddingVertical?: DimensionValue | undefined;
}

export function extractInternalLayoutStyle(src: StyleProp<ViewStyle>) {
    let flatten = StyleSheet.flatten(src);
    let res: LayoutInternalStyleProps = {};
    if (flatten.flexDirection !== undefined) res.flexDirection = flatten.flexDirection;
    if (flatten.rowGap !== undefined) res.rowGap = flatten.rowGap;
    if (flatten.gap !== undefined) res.gap = flatten.gap;
    if (flatten.columnGap !== undefined) res.columnGap = flatten.columnGap;
    if (flatten.flexWrap !== undefined) res.flexWrap = flatten.flexWrap;
    if (flatten.justifyContent !== undefined) res.justifyContent = flatten.justifyContent;
    if (flatten.alignItems !== undefined) res.alignItems = flatten.alignItems;
    if (flatten.padding !== undefined) res.padding = flatten.padding;
    if (flatten.paddingBottom !== undefined) res.paddingBottom = flatten.paddingBottom;
    if (flatten.paddingEnd !== undefined) res.paddingEnd = flatten.paddingEnd;
    if (flatten.paddingHorizontal !== undefined) res.paddingHorizontal = flatten.paddingHorizontal;
    if (flatten.paddingLeft !== undefined) res.paddingLeft = flatten.paddingLeft;
    if (flatten.paddingRight !== undefined) res.paddingRight = flatten.paddingRight;
    if (flatten.paddingStart !== undefined) res.paddingStart = flatten.paddingStart;
    if (flatten.paddingTop !== undefined) res.paddingTop = flatten.paddingTop;
    if (flatten.paddingVertical !== undefined) res.paddingVertical = flatten.paddingVertical;
    return res;
}