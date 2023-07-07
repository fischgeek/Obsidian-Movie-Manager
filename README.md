# Movie Manager - An Obsidian Plugin

There are a couple movie/media plugins out there for Obsidian. I wanted something a little more specific. I wanted to dedicate an entire vault to my owned movie/tv collection so I could make use of the graph view and see all the wonderful links!

**Note:** This is my first Obsidian plugin and is inspired by the Media DB Plugin and my own want list of features. 

## Features

- Add a Movie or TV series to your vault by using the global add command.
  - _Select your desired match from a list that includes the poster art._
- Rescan the currently opened file to update it in conjunction with your settings.
- Make use of the Banners plugin to create a really neat effect!
- Make use of the Custom File Explorer sorting plugin to ignore "the" in titles.
- Show which collections your movie belongs to (if any).
- Show x number of the cast in a particular movie/series.
- Show the production companies of a particular movie/series.
- Setup tags for which formats you own a movie/series.

## Required Settings

- **API Key** Required for obvious reasons. You can get one for free at [https://themoviedb.org](https://themoviedb.org)!

## Optional Settings

- **Use Banner** Each movie/series has poster art and backdrop art. With the Banners plugin, you can use the backdrop art for your banner (see examples below).

- **Ignore 'The' in Title** Ignore the word 'the' at the beginning of titles. Custom File Explorer sorting plugin is required for this to work and a sortspec that targets `sort_title`.

- **Show Collections** Adds the Collection section if the movie belongs to a Collection.

- **Show Cast** Adds the Cast section.

- **Cast Count** The number of cast members to include. _Specify `-1` for all._

- **Production Companies** Add the Production Companies section.

- **Show Formats** Shows your Owned Formats section.

- **Always Owned** A comma separated list of formats (tags) you want to add to the selection when a title is matched.

## Coming Soon Settings

- **Enumerate Cast** Have the plugin enumerate the matching number of cast members and automatically create a file for each with all the details.

- **Enumerate Collections** Have the plugin enumerate the Collections and automatically create a file for each with all the details.

- **Enumerate Seasons** Have the plugin enumerate the seasons of a series and automatically create a file for each with all the details.

- **Keywords** Show a tag list of keywords for a particular title.

## Examples

