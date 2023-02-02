import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Select, Option } from '@strapi/design-system';

import { getTrad } from '../../utils';

const PreviewSelect = ({ isDraft, target, previewOptions }) => {
    const { formatMessage } = useIntl();

    const handleSelect = url => {
        if (!url) {
            return;
        }

        window.open(url, target);
    };

    const label = formatMessage(isDraft ? {
        id: getTrad('form.button.draft'),
        defaultMessage: 'Open draft preview',
    } : {
        id: getTrad('form.button.published'),
        defaultMessage: 'Open live view',
    })

    return (
        <Select
            label={label}
            placeholder="Select tenant"
            onChange={handleSelect}
            selectButtonTitle="Carret Down Button">
            {previewOptions.map((previewOpt) => {
                return <Option value={previewOpt.url} style={{ cursor: 'pointer' }}>{previewOpt.label}</Option>
            })}
        </Select>
    )
};

PreviewSelect.propTypes = {
    isDraft: PropTypes.bool.isRequired,
    target: PropTypes.string.isRequired,
    previewOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default memo(PreviewSelect);
