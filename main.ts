import { App, Editor, MarkdownView, SuggestModal, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, parseFrontMatterAliases } from 'obsidian'
import { SearchMovie,GetMovieDetails } from 'tmdb'
import { MovieManagerSettings,IBook,IMovieSearchResult, IGenre } from 'interfaces'
import { WriteMediaToFile, truncate250 } from 'fun'
import { DEFAULT_SETTINGS, SettingsTab } from 'settings'
import { ConfirmModal } from 'confirm'

export default class MovieManager extends Plugin {
	settings: MovieManagerSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// new ConfirmModal(this.app, this.settings).open()

		this.addCommand({
			id: 'search-movie',
			name: 'Search for a movie',
			callback: () => {
				new SearchModal(this.app, async (result) => {
					console.log('apikey: ' + this.settings.apikey)
					if (!this.settings.apikey) {
						new Notice('Missing API Key')
					} else {
						let movieSearchResults = await SearchMovie(result, this.settings)
						new SearchResultModal(this.app, movieSearchResults, this.settings).open()
					}
					}).open()
			}
		})

		this.addCommand({
			id: 'suggest-modal',
			name: 'Suggest Modal',
			callback: () => {
				// this.app.vault.create("new file.md", "hello world")
				new SampleModal(this.app).open()
			}
		})

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		this.addRibbonIcon('dice', 'Hello World', () => {
			new Notice('Hello, world!');
			});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

export class SearchModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;
	
	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}
	
	onOpen() {
		const { contentEl } = this;
	
		contentEl.createEl("h1", { text: "Movie title" });
	
		new Setting(contentEl)
		.setName("Title")
		.addText((text) =>
			text.onChange((value) => {
				 this.result = value
			})
		);
	
		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Search")
			.setCta()
			.onClick(() => {
				this.close();
				this.onSubmit(this.result);
			}));
	}
	
	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
	
export class SearchResultModal extends SuggestModal<IMovieSearchResult> {
	Movies: IMovieSearchResult[]
	settings: MovieManagerSettings
	constructor(app: App, movies: IMovieSearchResult[], settings: MovieManagerSettings) {
		super(app);
		this.Movies = movies
		this.settings = settings
		}

	getSuggestions(query: string): IMovieSearchResult[] {
		return this.Movies.filter((movie) =>
		movie.title.toLowerCase().includes(query.toLowerCase()));
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
