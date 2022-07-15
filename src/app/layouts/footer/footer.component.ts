import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(()=>{



      $(document).ready(function() {
        $('#jezsel-ftmenu-show').click(function() {
          $('.jezsel-ftmenu').toggle("fadein");
        });
      });



      


    }, 200)
  }

}
