import { truncate250, WriteMovieMediaToFile, WriteTVMediaToFile } from "fun"
import { IMediaSearchResult, MediaType, MovieManagerSettings } from "interfaces"
import { ConfirmModal } from "modal-confirm"
import { SuggestModal, App } from "obsidian"

export class SearchResultModal extends SuggestModal<IMediaSearchResult> {
	mediaResults: IMediaSearchResult[]
	settings: MovieManagerSettings
	mediaType: MediaType
	constructor(app: App, mediaResults: IMediaSearchResult[], settings: MovieManagerSettings, mediaType: MediaType) {
		super(app)
		this.mediaResults = mediaResults
		this.settings = settings
		this.mediaType = mediaType
		}

	getSuggestions(query: string): IMediaSearchResult[] {
		return this.mediaResults.filter((media) =>
		media.title.toLowerCase().includes(query.toLowerCase()))
	}
	
	// Renders each suggestion item.
	renderSuggestion(media: IMediaSearchResult, el: HTMLElement) {
		const container = el.createEl("div", { cls: "search-results-title-container" })
		const left = el.createEl("div", { cls: "search-results-poster-container" })
		const right = el.createEl("div", { cls: "search-results-overview-container" })
		container.createEl("div", { text: media.title, cls: "search-results-title" })
		left.createEl("img", { attr:{"src": media.posterUrl, "width":"50"}})
		right.createEl("small", { text: truncate250(media.overview) })
	}
	
	// Perform action on the selected suggestion.
	async onChooseSuggestion(media: IMediaSearchResult, evt: MouseEvent | KeyboardEvent) {
		this.settings.formatList = [""]
		if (this.settings.showOwnedFormats) {
			new ConfirmModal(this.app, this.settings, async (fmtList) => {
				let formatList = fmtList.split(",")
				this.settings.formatList = formatList
				if (this.mediaType == MediaType.Movie) {
					await WriteMovieMediaToFile(media, this.settings)
				} else if (this.mediaType == MediaType.TV) {
					await WriteTVMediaToFile(media, this.settings)
				}
			}).open()
		} else {
			if (this.mediaType == MediaType.Movie) {
				await WriteMovieMediaToFile(media, this.settings)
			} else if (this.mediaType == MediaType.TV) {
				await WriteTVMediaToFile(media, this.settings)
			}
		}
	}
}
