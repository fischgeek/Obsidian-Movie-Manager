import { appendFileSync } from "fs";
import { IActor, IGenre, IMediaDetail, IMovieSearchResult, IProductionCompany, MovieManagerSettings } from "interfaces";
import { Notice, WorkspaceLeaf } from "obsidian";
import { GetMovieDetails } from "tmdb";

function truncate (s: string, max: number) {
	return s.substring(0, max)
}
export function truncate250 (s: string) {
	return truncate(s, 250)
}
function makeTagString (items: string[]) {
	let str = ""
	items.forEach((item: string) => {
		let g = item.replace(" ", "")
		str += `#${g} `
	})
	return str
}
function makeGenreTagString (genres: IGenre[]) {
	return makeTagString(genres.map(genre => {return genre.name}))
}
let xrn = (str:string) => { return `${str}\r\n` }
let xrnrn = (str:string) => { return `${str}\r\n\r\n` }
let rnx = (str:string) => { return `\r\n${str}` }
let rnrnx = (str:string) => { return `\r\n\r\n${str}` }

export async function WriteMediaToFile (movie: IMovieSearchResult, settings: MovieManagerSettings, formatList: string[]) {
  new Notice(`Selected ${movie.title}`);
  console.log('selected movie id: ' + movie.id)
  let movieDetail = await GetMovieDetails(movie.id, settings)
  let fileName = movieDetail.title + ".md"
  app.vault.adapter.write(fileName, "")
	app.vault.adapter.append(fileName, xrn("---"))
  if (settings.useBanner) {
    app.vault.adapter.append(fileName, xrn(`banner:\t'${movieDetail.backdropUrl}`))
  }
	app.vault.adapter.append(fileName, xrnrn("---"))
  app.vault.adapter.append(fileName, xrnrn(makeGenreTagString(movieDetail.genres)))
  app.vault.adapter.append(fileName, xrn(`![](${movieDetail.posterUrl})`))
  app.vault.adapter.append(fileName, xrn(`${movieDetail.overview}`))
  if (settings.showCast) {
		app.vault.adapter.append(fileName, xrn("## Cast"))
		debugger
    movieDetail.cast.forEach( (actor: IActor) => {
			app.vault.adapter.append(fileName, xrn(`[[${actor.name}]] ${actor.character}`))
    })
  }
  if (settings.showProductionCompanies) {
		app.vault.adapter.append(fileName, xrn("## Production Companies"))
    movieDetail.productionCompanies.forEach( (pc: IProductionCompany) => {
			app.vault.adapter.append(fileName, `[[${pc.name}]] | `)
    })
  }
	if (settings.showOwnedFormats) {
		app.vault.adapter.append(fileName, rnx(xrn("## Formats")))
		app.vault.adapter.append(fileName, xrn(makeTagString(formatList)))
	}
	// let lastOpen = app.workspace.getLastOpenFiles()
	// lastOpen.forEach((f:string) => {
	// 	console.log('file: ' + f)
	// })
}
