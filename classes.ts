export class MovieSearchResult {
	id: number
	title: string
	overview: string

	constructor(id: number, title: string, overview: string) {
		this.id = id
		this.title = title
		this.overview = overview
	}

	truncatedOverview(): string {
		return this.overview.substring(0, 250)
	}
}
