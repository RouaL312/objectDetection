import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { CheckBillService } from '../shared/service/check-bill.service';
@Component({
  selector: 'app-check-bill',
  templateUrl: './check-bill.component.html',
  styleUrls: ['./check-bill.component.scss']
})
export class CheckBillComponent implements OnInit,AfterViewInit  {
  files!: TreeNode[];
  alldata:any;
  cols!: any[];
  

  constructor( private messageService:MessageService, private checkBillService: CheckBillService) { }
  ngAfterViewInit (): void {
  

    }

  ngOnInit() {
    this.checkBillService.getCommandeVenteWithLigneCommande().subscribe(data=>{
      console.log(data)
      this.alldata=data  
      this.files = [];
      for(let i = 0; i <this.alldata.length ; i++) {
        let node = {
            data:{  
                name: 'Commande Vente ' + this.alldata[i].id_commande_vente,
                montant: this.alldata[i].montant_total_cmd,
                quantite: this.alldata[i].quantite,
            },
            children: [
                {
                    data: {  
                        name: 'Product code : ' + this.alldata[i].code_produit ,
                        Product_name: 'Product name: ' +this.alldata[i].name,
                        Price: 'Prix unitaire: ' +this.alldata[i].price,
                        category:  'Category: '+this.alldata[i].category,
                        montant: 'Montant total: '+this.alldata[i].montant_total_ligne,
                        quantite: 'Quantite total: '+this.alldata[i].quantite,
                    }
                }
            ]
        };

        this.files.push(node);
    }
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'Product_name', header: '' },
      { field: 'Price', header: '' },
      { field: 'category', header: '' },
      { field: 'montant', header: 'montant' },
      { field: 'quantite', header: 'quantite' },
  ];
  
      })



     /* for(let i = 0; i < 2; i++) {
          let node = {
              data:{  
                  name: 'Item ' + i,
                  size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                  type: 'Type ' + i
              },
              children: [
                  {
                      data: {  
                          name: 'Item ' + i + ' - 0',
                          size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                          type: 'Type ' + i
                      }
                  }
              ]
          };

          this.files.push(node);
      }

      this.cols = [
          { field: 'name', header: 'Name' },
          { field: 'size', header: 'Size' },
          { field: 'type', header: 'Type' }
      ];*/
  }
}
