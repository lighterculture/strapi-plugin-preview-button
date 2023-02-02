import React from 'react';
import { useSelector } from 'react-redux';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import { usePreviewUrl, usePreviewOptions } from '../../hooks';
import { pluginId } from '../../utils';
import { CopyLinkButton, PreviewButton, PreviewSelect } from '../';

const EditViewRightLinks = () => {
    const {
        allLayoutData,
        hasDraftAndPublish,
        isCreatingEntry,
        modifiedData,
    } = useCMEditViewDataManager();

    const config = useSelector(state => state[`${pluginId}_config`].config);
    const isDraft = hasDraftAndPublish && !modifiedData?.publishedAt;
    const { uid } = allLayoutData.contentType;
    const {
        canCopy,
        isLoading,
        isSupportedType,
        url,
        previewOptions
    } = usePreviewUrl(uid, modifiedData, isDraft, isCreatingEntry);

    if ((!url && !previewOptions) || !isSupportedType || isCreatingEntry || isLoading) {
        return null;
    }

    if (previewOptions) {
        // if previewOptions is present, use select
        return (
            <>
                <PreviewSelect isDraft={ isDraft } target={ config.openTarget } previewOptions={previewOptions} />
            </>
        );
    }

    return (
        <>
            <PreviewButton isDraft={ isDraft } url={ url } target={ config.openTarget } />
            {canCopy && <CopyLinkButton isDraft={isDraft} url={url} />}
        </>
    );
};

export default EditViewRightLinks;
