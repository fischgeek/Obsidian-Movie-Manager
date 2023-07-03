import { truncate250, WriteMediaToFile } from "fun"
import { IMovieSearchResult, MovieManagerSettings } from "interfaces"
import { ConfirmModal } from "modal-confirm"
import { SuggestModal, App } from "obsidian"

export class SearchResultModal extends SuggestModal<IMovieSearchResult> {
	Movies: IMovieSearchResult[]
	settings: MovieManagerSettings
	constructor(app: App, movies: IMovieSearchResult[], settings: MovieManagerSettings) {
		super(app)
		this.Movies = movies
		this.settings = settings
		}

	getSuggestions(query: string): IMovieSearchResult[] {
		return this.Movies.filter((movie) =>
		movie.title.toLowerCase().includes(query.toLowerCase()))
	}
	
	// Renders each suggestion item.
	renderSuggestion(movie: IMovieSearchResult, el: HTMLElement) {
		const container = el.createEl("div", { cls: "search-results-title-container" })
		const left = el.createEl("div", { cls: "search-results-poster-container" })
		const right = el.createEl("div", { cls: "search-results-overview-container" })
		container.createEl("div", { text: movie.title, cls: "search-results-title" })
		left.createEl("img", { attr:{"src": movie.posterUrl, "width":"50"}})
		right.createEl("small", { text: truncate250(movie.overview) })
	}
	
	// Perform action on the selected suggestion.
	async onChooseSuggestion(movie: IMovieSearchResult, evt: MouseEvent | KeyboardEvent) {
		if (this.settings.showOwnedFormats) {
			new ConfirmModal(this.app, this.settings, (fmtList) => {
				let formatList = fmtList.split(",")
				WriteMediaToFile(movie, this.settings, formatList)
			}).open()
		} else {
			WriteMediaToFile(movie, this.settings, [""])
		}
	}
}
