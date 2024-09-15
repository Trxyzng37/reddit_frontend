import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  constructor(
    private storageService: StorageService
  ) { }

  //0F1A1C
  public primary_background_color_light = "#ffffff";
  public primary_background_color_dark = "#0E1113";
  public secondary_color_light = "#000000";
  public secondary_color_dark = "#ffffff";
  public neutral_light = "#F9FAFA";
  public neutral_dark = "#0E1113";
  public link_light = "#0045AC";
  public link_dark = "#629FFF";
  public border_light = "#00000033";
  public border_dark = "#ffffff33";
  private search_light = "#E5EBEE";
  private search_dark = "#2A3236";
  private header_light = "#ffffff";
  private header_dark = "#0E1113";
  private info_light = "#F9FAFA";
  private info_dark = "#000000";
  private txt_light = "#2A3C42";
  private txt_dark = "#B8C5C9";
  private icon_light = "#000000";
  private icon_dark = "#ffffff";
  private nav_btn_light = "#F6F8F9";
  private nav_btn_dark = "#181C1F";
  private bg_hover_light = "#F6F8F9";
  private bg_hover_dark = "#181C1F";
  private btn_selected_light = "#D2DADD";
  private btn_selected_dark = "#33464C";

  //0 light, 1 dark
  useDarkMode() {
    const mode = this.storageService.getItem("mode") == "1" ? 1 : 0;
    if(mode == 1) {
      document.body.style.setProperty("--primary_background_color", this.primary_background_color_dark);
      document.body.style.setProperty("--neutral", this.neutral_dark);
      document.body.style.setProperty("--secondary_color", this.secondary_color_dark);
      document.body.style.setProperty("--link", this.link_dark);
      document.body.style.setProperty("--search", this.search_dark);
      document.body.style.setProperty("--header", this.header_dark);
      document.body.style.setProperty("--info", this.info_dark);
      document.body.style.setProperty("--txt", this.txt_dark);
      document.body.style.setProperty("--icon", this.icon_dark);
      document.body.style.setProperty("--border", this.border_dark);
      document.body.style.setProperty("--nav_hover", this.nav_btn_dark);
      document.body.style.setProperty("--bg_hover", this.bg_hover_dark);
      document.body.style.setProperty("--btn_selected", this.btn_selected_dark);
      // let el = document.querySelectorAll<HTMLElement>('p');
      // for(var i=0;i<el.length;i++){
      //   el[i].style.color = this.txt_dark;
      // }
    }
    else {
      this.storageService.setItem("mode", "0");
      document.body.style.setProperty("--primary_background_color", this.primary_background_color_light);
      document.body.style.setProperty("--neutral", this.neutral_light);
      document.body.style.setProperty("--secondary_color", this.secondary_color_light);
      document.body.style.setProperty("--link", this.link_light);
      document.body.style.setProperty("--search", this.search_light);
      document.body.style.setProperty("--header", this.header_light);
      document.body.style.setProperty("--info", this.info_light);
      document.body.style.setProperty("--txt", this.txt_light);
      document.body.style.setProperty("--icon", this.icon_light);
      document.body.style.setProperty("--border", this.border_light);
      document.body.style.setProperty("--nav_hover", this.nav_btn_light);
      document.body.style.setProperty("--bg_hover", this.bg_hover_light);
      document.body.style.setProperty("--btn_selected", this.btn_selected_light);
      // let el = document.querySelectorAll<HTMLElement>('p');
      // for(var i=0;i<el.length;i++){
      //   el[i].style.color = this.txt_light;
      // }
    }
  }
}
