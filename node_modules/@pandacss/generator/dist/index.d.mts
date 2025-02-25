import * as _pandacss_types from '@pandacss/types';
import { LoadConfigResult, ArtifactId, CssArtifactType } from '@pandacss/types';
import { Context, Stylesheet, StyleDecoder } from '@pandacss/core';

declare class Generator extends Context {
    constructor(conf: LoadConfigResult);
    getArtifacts: (ids?: ArtifactId[] | undefined) => _pandacss_types.Artifact[];
    appendCssOfType: (type: CssArtifactType, sheet: Stylesheet) => void;
    appendLayerParams: (sheet: Stylesheet) => void;
    appendBaselineCss: (sheet: Stylesheet) => void;
    appendParserCss: (sheet: Stylesheet) => void;
    getParserCss: (decoder: StyleDecoder) => string;
    getCss: (stylesheet?: Stylesheet) => string;
}

export { Generator };
