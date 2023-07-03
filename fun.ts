import { IActor, IGenre, IMediaDetail, IMovieSearchResult, IProductionCompany, MovieManagerSettings } from "interfaces";
import { Notice } from "obsidian";
import { GetMovieDetails } from "tmdb";

function truncate (s: string, max: number) {
	return s.substring(0, max)
}
export function truncate250 (s: string) {
	return truncate(s, 250)
}
function makeGenreTagString (genres: IGenre[]) {
	let str = ""
	genres.forEach((genre: IGenre) => {
		let g = genre.name.replace(" ", "")
		str += `#${g} `
	})
	return str
}

export async function WriteMediaToFile (movie: IMovieSearchResult, settings: MovieManagerSettings) {
  new Notice(`Selected ${movie.title}`);
  console.log('selected movie id: ' + movie.id)
  let movieDetail = await GetMovieDetails(movie.id, settings)
  let fileName = movieDetail.title + ".md"
  app.vault.adapter.write(fileName, "")
  if (settings.useBanner) {
    app.vault.adapter.append(fileName, "---\r\n")
    app.vault.adapter.append(fileName, `banner:\t'${movieDetail.backdropUrl}'\r\n`)
    app.vault.adapter.append(fileName, `meta:\t'data'\r\n`)
    app.vault.adapter.append(fileName, "---\r\n\r\n")
    app.vault.adapter.append(fileName, "# new line\r\n")
  }
  app.vault.adapter.append(fileName, makeGenreTagString(movieDetail.genres) + "\r\n\r\n")
  app.vault.adapter.append(fileName, `![](${movieDetail.posterUrl})\r\n`)
  app.vault.adapter.append(fileName, `${movieDetail.overview}\r\n`)
  if (settings.showCast) {
    app.vault.adapter.append(fileName, "\r\n## Cast\r\n")
    let sliced = movieDetail.cast.slice(0, 5)
    sliced.forEach( (actor: IActor) =>{
      app.vault.adapter.append(fileName, `[[${actor.name}]] ${actor.character}\r\n`)
    })
  }
  if (settings.showProductionCompanies) {
    app.vault.adapter.append(fileName, "\r\n## Production Companies\r\n")
    movieDetail.productionCompanies.forEach( (pc: IProductionCompany) =>{
      app.vault.adapter.append(fileName, `[[${pc.name}]] | `)
    })
  }
}