//app/services/firebase.service.ts
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc ,addDoc,collection, collectionData,query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  //AUTENTICACION FIREBASE

  getAuth(){
    return getAuth();
  }

  // INICIAR SESION
  singIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // CREAR USUARIO
  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // ACTUALIZAR USUARIO
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  singOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //BASE DE DATOS

  getCollectionData(path:string, collectionQuery?:any){
    const ref = collection(getFirestore(),path);
    return collectionData(query(ref,...collectionQuery),{idField:'id'});
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //ACTUALIZAR UN DOCUMENTO
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //ELIMINAR UN DOCUMENTO
  deleteDocument(path: string){
    return deleteDoc(doc(getFirestore(), path));
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //AGREGAR UN DOCUMENTO
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //ALMACENAMIENTO DE DATOS

  //SUBIR IMAGEN
  async uploadImage(path:string, data_url:string){
    return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path));
    });
  }

  //OBTENER RUTA IMAGEN CON URL
  async getFilePath(url:string){
    return ref(getStorage(),url).fullPath;
  }

  //ELIMINAR ARCHIVOS
  deleteFile(path:string){
    return deleteObject(ref(getStorage(),path));
  }

}
