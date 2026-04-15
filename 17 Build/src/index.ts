import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import type { UmbAuthContext } from '@umbraco-cms/backoffice/auth';

interface TypeUsage {
    id: number;
    guid: string;
    name: string;
    path: string[];
    type: string;
}

interface TypeUsageResult {
    dataTypes: number;
    documentTypes: number;
    umbracoDataTypes: number;
    thirdPartyDataTypes: number;
}

interface TypeUsageResponse {
    isSuccess: boolean;
    dataTypes: TypeUsage[];
    documentTypes: TypeUsage[];
    umbracoDataTypes: TypeUsage[];
    thirdPartyDataTypes: TypeUsage[];
    typeUsageResult: TypeUsageResult;
}

type SectionKey = 'documentTypes' | 'dataTypes' | 'thirdPartyDataTypes' | 'umbracoDataTypes';

const SECTION_LABELS: Record<SectionKey, string> = {
    documentTypes: 'Document Types',
    dataTypes: 'Data Types',
    thirdPartyDataTypes: 'Third Party Data Types',
    umbracoDataTypes: 'Umbraco Data Types',
};

@customElement('declutter-types-element')
export class DeclutterTypesElement extends UmbElementMixin(LitElement) {
    @state() private _isRunning = false;
    @state() private _saveResponse = false;
    @state() private _hasResults = false;
    @state() private _documentTypes: TypeUsage[] = [];
    @state() private _dataTypes: TypeUsage[] = [];
    @state() private _thirdPartyDataTypes: TypeUsage[] = [];
    @state() private _umbracoDataTypes: TypeUsage[] = [];
    @state() private _counts: TypeUsageResult = { dataTypes: 0, documentTypes: 0, umbracoDataTypes: 0, thirdPartyDataTypes: 0 };
    @state() private _openSections: Set<SectionKey> = new Set();

    private _authContext?: UmbAuthContext;

    async connectedCallback() {
        super.connectedCallback();
        this._authContext = await this.getContext(UMB_AUTH_CONTEXT);
        await this._loadSavedValues();
    }

    private async _getAuthHeaders(): Promise<Record<string, string>> {
        if (!this._authContext) return {};
        const token = await this._authContext.getLatestToken();
        return { 'Authorization': `Bearer ${token}` };
    }

    private async _loadSavedValues() {
        const headers = await this._getAuthHeaders();
        const response = await fetch('/umbraco/management/api/v1/decluttertypes/GetSavedValues', { headers });
        if (response.ok) {
            const data: TypeUsageResponse = await response.json();
            if (data.isSuccess) this._applyResults(data);
        }
    }

    private async _runDeclutter() {
        this._isRunning = true;
        const headers = await this._getAuthHeaders();
        const url = `/umbraco/management/api/v1/decluttertypes/GetValues?isSaving=${this._saveResponse}`;
        const response = await fetch(url, { headers });
        if (response.ok) {
            const data: TypeUsageResponse = await response.json();
            if (data.isSuccess) this._applyResults(data);
        }
        this._isRunning = false;
    }

    private _applyResults(data: TypeUsageResponse) {
        this._documentTypes = data.documentTypes;
        this._dataTypes = data.dataTypes;
        this._thirdPartyDataTypes = data.thirdPartyDataTypes;
        this._umbracoDataTypes = data.umbracoDataTypes;
        this._counts = data.typeUsageResult;
        this._hasResults = true;
    }

    private _toggleSection(key: SectionKey) {
        const next = new Set(this._openSections);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        this._openSections = next;
    }

    private _getEditUrl(item: TypeUsage): string {
        if (item.type === 'documentType') {
            return `/umbraco/section/settings/workspace/document-type/edit/${item.guid}`;
        }
        return `/umbraco/section/settings/workspace/data-type/edit/${item.guid}`;
    }

    render() {
        return html`
            <uui-box headline="Declutter Types" class="mb-1">
                <div class="intro">
                    <p class="beta-notice">This tool is in Beta. Based on our knowledge of Umbraco and how to find in-use properties and document/data types — if you note a specific type and would like us to investigate, please raise an issue in <a href="https://github.com/SamR-DWL/DigitalWonderlab.DeclutterTypes/issues" target="_blank">GitHub</a>.</p>
                    <p>This tool will scan your <strong>published</strong> content for in-use document types and data types. It will also scan your media content for in-use data types and properties.</p>
                    <p>Running this tool will show a list of data types and document types that it has found not in use. This is not an exhaustive list — some settings or customised views may still be used but marked as unused, so delete with caution.</p>
                    <p>The items will be organised in the manner they are in Umbraco, reflecting the hierarchy and structure of your document and data types. Each item below will contain a link to their place in Umbraco for you to do a final check before deleting.</p>
                    <hr />
                </div>

                <div class="controls">
                    <uui-button
                        look="primary"
                        color="positive"
                        ?disabled=${this._isRunning}
                        @click=${this._runDeclutter}
                    >
                        ${this._isRunning ? html`<uui-loader-circle></uui-loader-circle> Running...` : 'Run'}
                    </uui-button>
                    <uui-toggle
                        label="Save in Tool"
                        ?checked=${this._saveResponse}
                        @change=${(e: any) => this._saveResponse = e.target.checked}
                    >Save in Tool</uui-toggle>
                </div>
            </uui-box>

            ${this._hasResults ? this._renderResults() : nothing}
        `;
    }

    private _renderResults() {
        return html`
            <uui-box class="mb-1">
                <div class="results-summary">
                    <h3>Results</h3>
                    <p>Document Types not used: <strong>${this._counts.documentTypes}</strong></p>
                    <p>Data Types not used: <strong>${this._counts.dataTypes}</strong></p>
                    <p>Third Party Data Types (unknown if used): <strong>${this._counts.thirdPartyDataTypes}</strong></p>
                    <p>Umbraco Types: <strong>${this._counts.umbracoDataTypes}</strong></p>
                </div>
            </uui-box>

            ${this._renderSection('documentTypes', this._documentTypes)}
            ${this._renderSection('dataTypes', this._dataTypes)}
            ${this._renderSection('thirdPartyDataTypes', this._thirdPartyDataTypes)}
            ${this._renderSection('umbracoDataTypes', this._umbracoDataTypes)}
        `;
    }

    private _renderSection(key: SectionKey, items: TypeUsage[]) {
        if (!items.length) return nothing;
        const isOpen = this._openSections.has(key);
        const label = SECTION_LABELS[key];

        const groups = new Map<string, TypeUsage[]>();
        for (const item of items) {
            const parent = item.path.length >= 2 ? (item.path[item.path.length - 2] ?? 'Root') : 'Root';
            if (!groups.has(parent)) groups.set(parent, []);
            groups.get(parent)!.push(item);
        }

        return html`
            <uui-box class="mb-1">
                <div class="section-header" @click=${() => this._toggleSection(key)}>
                    <span class="chevron ${isOpen ? 'open' : ''}">›</span>
                    <h3>${label}</h3>
                </div>
                ${isOpen ? html`
                    <div class="section-body">
                        ${key === 'thirdPartyDataTypes' ? html`
                            <p class="caveat">While this tool has verified whether the property has a value, we cannot be sure if the lack of a value is intentional. Treat these entries with care.</p>
                        ` : nothing}
                        ${[...groups.entries()].map(([group, groupItems]) => html`
                            <div class="group">
                                <div class="group-label">${group}</div>
                                ${groupItems.map(item => html`
                                    <div class="item-card">
                                        <strong>${item.name}</strong>
                                        <span class="item-id">ID: ${item.id}</span>
                                        <a href="${this._getEditUrl(item)}" target="_blank">Open in Umbraco</a>
                                    </div>
                                `)}
                            </div>
                        `)}
                    </div>
                ` : nothing}
            </uui-box>
        `;
    }

    static styles = css`
        :host {
            display: block;
            padding: var(--uui-size-layout-1);
        }

        .intro p {
            margin: var(--uui-size-space-3) 0;
        }

        .mb-1{
            margin-bottom:var(--uui-size-space-4);
        }

        .beta-notice {
            padding: var(--uui-size-space-3);
            background: var(--uui-color-warning-emphasis);
            border-radius: var(--uui-border-radius);
        }

        .controls {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
            margin-top: var(--uui-size-space-4);
        }

        .results-summary p {
            margin: var(--uui-size-space-2) 0;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-3);
            cursor: pointer;
            user-select: none;
        }

        .section-header h3 {
            margin: 0;
        }

        .chevron {
            font-size: 1.2em;
            transition: transform 0.2s;
            display: inline-block;
        }

        .chevron.open {
            transform: rotate(90deg);
        }

        .section-body {
            margin-top: var(--uui-size-space-3);
        }

        .caveat {
            font-style: italic;
            color: var(--uui-color-text-alt);
            margin-bottom: var(--uui-size-space-3);
        }

        .group {
            margin-bottom: var(--uui-size-space-4);
        }

        .group-label {
            font-weight: bold;
            padding: var(--uui-size-space-2) 0;
            border-bottom: 1px solid var(--uui-color-border);
            margin-bottom: var(--uui-size-space-2);
        }

        .item-card {
            display: flex;
            align-items: center;
            gap: var(--uui-size-space-4);
            padding: var(--uui-size-space-2) var(--uui-size-space-3);
            border-radius: var(--uui-border-radius);
            margin-bottom: var(--uui-size-space-1);
        }

        .item-card:hover {
            background: var(--uui-color-surface-emphasis);
        }

        .item-id {
            color: var(--uui-color-text-alt);
            font-size: 0.85em;
        }

        .item-card a {
            margin-left: auto;
            color: var(--uui-color-interactive);
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'declutter-types-element': DeclutterTypesElement;
    }
}
