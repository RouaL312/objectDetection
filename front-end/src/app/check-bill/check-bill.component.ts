import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { CheckBillService } from '../shared/service/check-bill.service';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
@Component({
  selector: 'app-check-bill',
  templateUrl: './check-bill.component.html',
  styleUrls: ['./check-bill.component.scss']
})
export class CheckBillComponent implements OnInit  {
  files!: TreeNode[];
  alldata:any;
  cols!: any[];
  

  constructor( private title:Title,private messageService:MessageService, 
    private checkBillService: CheckBillService,private currencyPipe: CurrencyPipe,private localStorageService:LocalStorageService) { 
        title.setTitle('Orders')
    }


  ngOnInit() {
    this.checkBillService.getCommandeVenteWithLigneCommande().subscribe(data=>{
      console.log(data)
      this.alldata=data  
      this.files = [];
      for(let i = 0; i < this.alldata.length; i++) {
        if(this.alldata[i].login ==this.localStorageService.retrieve('login') || this.localStorageService.retrieve('authorities'))
        {
        let children = [];
        for(let j = 0; j < this.alldata[i].ligne_commande.length; j++) {
          children.push({
            data: {  
                name: 'Product name: ' +this.alldata[i].ligne_commande[j].product_name,
               montant: 'Prix unitaire: ' +this.currencyPipe.transform(this.alldata[i].ligne_commande[j].product_price, 'EUR', 'symbol', '1.2-2'),
              quantite: 'Quantite : '+this.alldata[i].ligne_commande[j].quantite,
            }
          });
        }
        let node = {
          data: {  
            name: 'Commande Vente ' + this.alldata[i].id_commande_vente,
            montant:  this.currencyPipe.transform(this.alldata[i].montant_total, 'EUR', 'symbol', '1.2-2'),
            quantite: this.alldata[i].date_commande,
            user: this.alldata[i].login,
          },
          children: children
        }
        this.files.push(node);
    }
      }
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'montant', header: 'Montant' },
      { field: 'quantite', header: 'Creation date' },
      { field: 'user', header: 'Client name' },
  ];
  
      })
  }
}
