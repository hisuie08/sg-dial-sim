import { Component, ElementRef, NgZone, OnInit } from "@angular/core";

import { TimelineLite, TweenMax } from "gsap";

import { EventHorizonAnimations } from "app/shared/animations";
import { GateStatus } from "app/shared/models";
import { AudioService, GateStatusService } from "app/shared/services";

@Component({
	selector: "event-horizon",
	templateUrl: "./event-horizon.component.html",
	styleUrls: ["./event-horizon.component.scss"],
})
export class EventHorizonComponent implements OnInit {
	private readonly ignoredStatuses = [GateStatus.Dialing, GateStatus.Engaged];

	private get elem(): HTMLElement {
		return this._elem.nativeElement;
	}

	constructor(
		private audio: AudioService,
		private _elem: ElementRef,
		private gateStatus: GateStatusService,
		private ngZone: NgZone
	) {}

	ngOnInit() {
		this.gateStatus.subscribe(status => {
			if (!this.ignoredStatuses.includes(status)) {
				this.setAnimation(status);
			}
		});
	}

	private setAnimation(status: GateStatus): TimelineLite {
		TweenMax.killTweensOf(this.elem);
		switch (status) {
			case GateStatus.Idle:
				return EventHorizonAnimations.inactiveFlasher(this.elem);
			case GateStatus.Active:
				return EventHorizonAnimations.gateOpen(this.elem).add(() => this.audio.startEventHorizon(), 0);
			case GateStatus.Shutdown:
				return new TimelineLite()
					.add(EventHorizonAnimations.shutdown(this.elem))
					.add(() => this.audio.stopEventHorizon(), 0)
					.add(() => this.ngZone.run(() => this.gateStatus.idle()), "+=1");
		}
	}
}