import { MovieManagerSettings } from "interfaces";
import MovieManager from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab {
	plugin: MovieManager;
	settings: MovieManagerSettings

	constructor(app: App, plugin: MovieManager) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings
	}

	display(): void {
		const {containerEl} = this;
		let addToggle = (name: string, desc: string, boolVal: boolean) => {
			new Setting(containerEl)
					.setName(name)
					.setDesc(desc)
					.addToggle(tgl => {
						tgl.setValue(boolVal)
						tgl.onChange(async (val) => {
							boolVal = val
							await this.plugin.saveSettings()
							console.log('saved settings')
						})
					})
		}

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Movie Manager'});

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Your api key. Get one free at https://developer.themoviedb.org!')
			.addText(text => text
				.setPlaceholder('api key')
				.setValue(this.plugin.settings.apikey)
					.onChange(async (value) => {
					console.log('api key: ' + value)
					this.plugin.settings.apikey = value
					await this.plugin.saveSettings()
					this.plugin.registerView
				})
			)

		new Setting(containerEl)
			.setName("User Banner")
			.setDesc("Adds the banner front matter to be used with the Banners plugin.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.useBanner)
				tgl.onChange(async (val) => {
					this.settings.useBanner = val
					await this.plugin.saveSettings()
				})
			})

		new Setting(containerEl)
			.setName("Show Cast")
			.setDesc("Adds the Cast section.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showCast)
				tgl.onChange(async (val) => {
					this.settings.showCast = val
					await this.plugin.saveSettings()
				})
			})
		
		new Setting(containerEl)
			.setName("Show Production Companies")
			.setDesc("Add the Production Companies section.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showProductionCompanies)
				tgl.onChange(async (val) => {
					this.settings.showProductionCompanies = val
					await this.plugin.saveSettings()
				})
			})
	
		new Setting(containerEl)
			.setName("Show Formats")
			.setDesc("Shows your Owned Formats section.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showOwnedFormats)
				tgl.onChange(async (val) => {
					this.settings.showOwnedFormats = val
					await this.plugin.saveSettings()
					this.display()
				})
			})
		
		if (this.settings.showOwnedFormats) {
			new Setting(containerEl)
				.setName('Formats')
				.setDesc(createFragment(frag => {
					frag.appendText("A comma separated list of formats (tags) you want to add to the selection when a title is matched. Please keep in mind the allowed list of characters in a tag. Ex: in the tag")
					frag.createEl("code", { text: "#Disney+", attr: { class: "tag-sample" } })
					frag.appendText(", the '+' will be rendered as literal text and not part of the tag.")
				}))
				.addText(text => text
					.setPlaceholder('Blu-ray,DVD,Plex')
					.setValue(this.plugin.settings.formats.toString())
						.onChange(async (value) => {
							this.plugin.settings.formats = value.split(",")
							await this.plugin.saveSettings()
					})
				)
		}
	}
}
