import { html, render } from "https://unpkg.com/lit-html@1.0.0/lit-html.js";

class Fdc3ChannelPickerComponent extends HTMLElement {
  constructor() {
    super();
    this.render = this.render.bind(this);

    this.showIcon = false;
    this.showChannelList = false;
    this.channelId = undefined;
    this.iconColor = null;
    this.iconId = null;
    this.availableChannels = [];
    this.init();
    this.render();
  }

  async updateChannel(fdc3ChannelId) {
    let channel = await window.fdc3.getChannelById(fdc3ChannelId);
    this.channelId = fdc3ChannelId;

    await channel.join();
  }

  async init() {
    if (window.fdc3 !== undefined) {
      let defaultChannel = { id: "default", color: "#FFFFFF" };
      this.showIcon = true;
      this.iconColor = defaultChannel.color;
      this.iconId = defaultChannel.id;

      this.addEventListener("mouseenter", () => {
        this.showChannelList = true;
        this.render();
      });
      this.addEventListener("mouseleave", () => {
        this.showChannelList = false;
        this.render();
      });

      this.availableChannels.push(defaultChannel);

      let fdc3Channels = await window.fdc3.getSystemChannels();

      fdc3Channels.forEach((channel) => {
        this.availableChannels.push({
          id: channel.id,
          color: channel.visualIdentity.color
        });
      });

      window.fdc3.addEventListener("channel-changed", (evt) => {
        if (window.fin.me.identity.name === evt.identity.name) {
          let isSystemChannel = false;
          if (evt.channel !== undefined && evt.channel !== null) {
            console.log("Channel Changed: New Channel: " + evt.channel.id);

            if (
              evt.previousChannel !== undefined &&
              evt.previousChannel !== null
            ) {
              console.log("Previous Channel: " + evt.previousChannel.id);
            }

            isSystemChannel =
              evt.channel.type === "system" &&
              evt.channel.visualIdentity !== undefined;
          }

          if (isSystemChannel) {
            this.iconColor = evt.channel.visualIdentity.color;
            this.iconId = evt.channel.id;
          } else {
            this.iconColor = defaultChannel.color;
            this.iconId = defaultChannel.id;
          }
          this.showChannelList = false;
          this.render();
        }
      });

      const urlParams = new URLSearchParams(window.location.search);
      const fdc3ChannelId = urlParams.get("fdc3Channel");
      if (fdc3ChannelId !== undefined && fdc3ChannelId !== null) {
        await this.updateChannel(fdc3ChannelId);
      }

      this.render();
    }
  }

  async render() {
    const channelIndicator = html`
      ${this.showChannelList
        ? html`
            <span
              title="Current channel is ${this.iconId}"
              style="padding: 0px 5px;color:${this.iconColor}"
              >&#11044;</span
            >
            ${this.availableChannels.map((availableChannel) => {
              if (availableChannel.id !== this.iconId) {
                return html`<span
                  title="Switch to ${availableChannel.id} channel"
                  class="fade-in"
                  style="padding: 0px 5px;color:${availableChannel.color};cursor: pointer;"
                  @click=${async () => {
                    await this.updateChannel(availableChannel.id);
                  }}
                  >&#11044;</span
                >`;
              } else {
                return null;
              }
            })}
          `
        : html`
            <span
              title="Current channel is ${this.iconId}"
              style="padding: 0px 10px;color:${this.iconColor}"
              >&#11044;</span
            >
          `}
    `;
    return render(channelIndicator, this);
  }
}

customElements.define("fdc3-channel-picker", Fdc3ChannelPickerComponent);
