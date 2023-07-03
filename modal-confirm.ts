import { MovieManagerSettings } from "interfaces"
import { Modal, App, Setting } from "obsidian"

export class ConfirmModal extends Modal {
	result: string
	onSubmit: (result: string) => void
	settings: MovieManagerSettings
	formatList: string[]
	
	constructor(app: App, settings: MovieManagerSettings, onSubmit: (result: string) => void) {
		super(app)
		this.onSubmit = onSubmit
		this.settings = settings
		this.formatList = new Array()
	}
	
	// onSubmit (res:string) {
	// 	console.log('Chosen formats: ')
	// 	console.log(this.formatList.toString())
	// 	return this.formatList.toLocaleString()
	// }

	onOpen() {
		const { contentEl } = this
		contentEl.createEl("h1", { text: "Select your owned formats" })

		this.settings.formats.forEach((format: string) => {
			new Setting(contentEl)
			.setName(format)
			.addToggle((tgl) => {
				if (this.settings.defaultFormatsToTrue) {
					tgl.setValue(true)
					this.formatList.push(format)
				}
				tgl.onChange((value:boolean) => {
					// debugger
					if (value == true) {
						this.formatList.push(format)
					} else {
						this.formatList.remove(format)
					}
				})
			})
		})
	
		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Submit")
			.setCta()
			.onClick(() => {
				this.close()
				this.onSubmit(this.formatList.toString())
			}))
	}
	
	onClose() {
		let { contentEl } = this
		contentEl.empty()
	}
}
