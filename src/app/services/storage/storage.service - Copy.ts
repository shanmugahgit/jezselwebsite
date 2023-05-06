import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setToken(params: any){
    localStorage.setItem('jwtMDTToken', params);
  }

  getToken(){
    let token = localStorage.getItem('jwtMDTToken')
    return token;
  }

  setRole(params: any){
    localStorage.setItem('jwtMDTRole', params);
  }

  getRole(){
    let token = localStorage.getItem('jwtMDTRole')
    return token;
  }

  setUserDetails(params: any){
    localStorage.setItem('jwtMDTUserDetails', JSON.stringify(params));
  }

  getUserDetails(){
    let userDetails = localStorage.getItem('jwtMDTUserDetails')
    if(userDetails){
      userDetails = JSON.parse(userDetails);
    }
    return userDetails;
  }

  clearUser(){
    localStorage.removeItem('jwtMDTToken');
    localStorage.removeItem('jwtMDTUserDetails');
  }

  setProducts(params: any){
    let searchItem = localStorage.getItem('search');
    if(searchItem){
      params['search'] = JSON.parse(searchItem);
    }
    let products: any = localStorage.getItem('jwtMDTProducts');
    if(products){
      products = JSON.parse(products);
    }
    else{
      products = [];
    }
    products.push(params);
    localStorage.setItem('jwtMDTProducts', JSON.stringify(products));
  }

  getProducts(){
    let products = localStorage.getItem('jwtMDTProducts')
    if(products){
      products = JSON.parse(products);
    }
    return products;
  }

  clearSingleProduct(products: any){
    localStorage.setItem('jwtMDTProducts', JSON.stringify(products));
  }

  clearProducts(){
    localStorage.setItem('jwtMDTProducts', JSON.stringify([]));
  }
}
