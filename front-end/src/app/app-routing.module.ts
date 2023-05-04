import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./shared/guard/auth-guard.service";
import {LoginGuardService} from "./shared/guard/login-guard.service";
import {AdminComponent} from "./admin/admin.component";
import {LayoutsComponent} from "./layouts/layouts.component";
import {ParametreComponent} from "./parametre/parametre.component";
import {UsersComponent} from "./users/users.component";
import { ProfileComponent } from './apps/profile/profile.component';
import { PostDetailsComponent } from './apps/post-details/post-details.component';
import { ProductsComponent } from './products/products.component';
import { InvoiceComponent } from './apps/shop/invoice/invoice.component';
import { EditProductsComponent } from './products/edit-products/edit-products.component';
import { OrderComponent } from './apps/shop/order/order.component';
import { RecognitionComponent } from './recognition/recognition.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CheckBillComponent } from './check-bill/check-bill.component';


const routes: Routes = [
  {path: '', redirectTo: 'admin', pathMatch: 'full'},
  { path: 'login', component: LoginComponent,canActivate: [LoginGuardService]},

  { path: 'admin', component: LayoutsComponent, canActivate: [AuthGuard], children: [
      { path: '', component: AdminComponent},
      {path: 'parametre', component: ParametreComponent},
      {path: 'users', component: UsersComponent},
      {path: 'app-profile',component: ProfileComponent},
      {path: 'post-details',component: PostDetailsComponent},
      {path: 'products',component: ProductsComponent},
      {path: 'invoices',component: InvoiceComponent},
      {path: 'Editproducts',component: EditProductsComponent},
      {path: 'orders',component: CheckBillComponent},
      {path: 'recognition',component: RecognitionComponent},
      {path: 'ecom-product-detail',component: ProductDetailsComponent}
      
    ]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
