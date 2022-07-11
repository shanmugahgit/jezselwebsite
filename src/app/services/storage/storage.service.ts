import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setToken(params: any){
    // localStorage.setItem('jwtJezselToken', JSON.stringify(params));
    localStorage.setItem('jwtJezselToken', params);
  }

  getToken(){
    let token = localStorage.getItem('jwtJezselToken')
    // if(token){
    //   token = JSON.parse(token);
    // }
    return token;
  }

  setUserDetails(params: any){
    localStorage.setItem('jwtJezselUserDetails', JSON.stringify(params));
  }

  getUserDetails(){
    let userDetails = localStorage.getItem('jwtJezselUserDetails')
    if(userDetails){
      userDetails = JSON.parse(userDetails);
    }
    return userDetails;
  }

  clearUser(){
    localStorage.removeItem('jwtJezselToken');
    localStorage.removeItem('jwtJezselUserDetails');
    // localStorage.clear();
  }

  setProducts(params: any){
    let searchItem = localStorage.getItem('search');
    if(searchItem){
      params['search'] = JSON.parse(searchItem);
    }
    let products: any = localStorage.getItem('jwtJezselProducts');
    if(products){
      products = JSON.parse(products);
    }
    else{
      products = [];
    }
    products.push(params);
    localStorage.setItem('jwtJezselProducts', JSON.stringify(products));
  }

  getProducts(){
    let products = localStorage.getItem('jwtJezselProducts')
    if(products){
      products = JSON.parse(products);
    }
    return products;
  }

  clearSingleProduct(products: any){
    localStorage.setItem('jwtJezselProducts', JSON.stringify(products));
  }

  clearProducts(){
    localStorage.setItem('jwtJezselProducts', JSON.stringify([]));
  }
}
