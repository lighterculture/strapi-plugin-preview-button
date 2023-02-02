import { useEffect, useState } from 'react';
import { useStrapiApp } from '@strapi/helper-plugin';

import { HOOK_BEFORE_BUILD_URL } from '../constants';
import { usePluginConfig } from '../hooks';
import { parseUrl } from '../utils';

const usePreviewUrl = ( uid, data, isDraft, isCreating ) => {
  const { runHookWaterfall } = useStrapiApp();
  const { config, isLoading } = usePluginConfig();
  const [ url, setUrl ] = useState( null );
  const [ previewOptions, setPreviewOptions ] = useState( null );
  const [ canCopy, setCopy ] = useState( true );

  const { contentTypes } = config;

  const contentTypeConfig = contentTypes?.find( type => type.uid === uid );
  const isSupportedType = !! contentTypeConfig;

  useEffect( () => {
    if ( isLoading || isCreating || ! isSupportedType ) {
      return;
    }

    const stateFromConfig = contentTypeConfig[ isDraft ? 'draft' : 'published' ];

    // Run hook waterfall asynchronously, as our hooks my need to fetch data from the API
    runHookWaterfall( HOOK_BEFORE_BUILD_URL, { state: stateFromConfig, data }, true ).then( ( { state } ) => {
        // If the hook returns an array, we'll show a select dropdown, and need to parse each url
        if (Array.isArray(state)) {
            const finalState = state.map((item) => {
                return {
                    ...item,
                    url: parseUrl( item, data )
                }
            })
            setPreviewOptions(finalState)
            return
        }

        // Otherwise, we'll just show a single button
        const url = parseUrl( state, data );
        setUrl( url );
        setCopy( state?.copy === false ? false : true );

        if ( ! url ) {
            return;
        }
    } ).catch( () => {
        setUrl( null );
        setCopy( false );
    } );

  }, [ isDraft, isCreating, isLoading, data ] );

  return {
    canCopy,
    isLoading,
    isSupportedType,
    url,
    previewOptions
  };
};

export default usePreviewUrl;
