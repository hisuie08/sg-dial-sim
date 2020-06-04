import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { AlertService } from "app/shared/services";

@Component({
	selector: "sg-address-field",
	templateUrl: "./address-field.component.html",
	styleUrls: ["./address-field.component.scss"],
})
export class AddressFieldComponent {
	@HostBinding("class.editable") @Input() editable: boolean = false;
	@Input() label: string;
	@Input() validation: string = ".*";
	@Output() saveValue: EventEmitter<string> = new EventEmitter<string>();

	public editMode: boolean = false;

	private lastInputValue: string;
	private workingValue: string;

	public get elem(): HTMLElement {
		return this._elem.nativeElement;
	}

	@Input() set value(newValue: string) {
		this.workingValue = this.lastInputValue = newValue || "";
	}

	public constructor(private alert: AlertService, private _elem: ElementRef) {}

	@HostListener("blur")
	public onBlur() {
		this.editMode = false;
		if (this.workingValue === this.lastInputValue) {
			return;
		}

		if (this.workingValue.match(this.validation)) {
			this.saveValue.emit(this.workingValue);
		} else {
			this.alert.alerts.next({
				critical: true,
				duration: 4000,
				message: "Field value is invalid",
				title: "Input Error",
			});
			this.elem.focus();
		}
	}

	@HostListener("focus")
	public onFocus() {
		this.editMode = true;
	}

	@HostListener("keydown", ["$event"])
	public onKeydown(event: KeyboardEvent) {
		if (event.key.match(/^.$/i) && this.workingValue.length < 25) {
			this.workingValue += event.key;
		} else if (event.key === "Backspace" && this.workingValue.length > 0) {
			this.workingValue = this.workingValue.substring(0, this.workingValue.length - 1);
		} else if (event.key === "Enter") {
			this.elem.blur();
		}
	}
}