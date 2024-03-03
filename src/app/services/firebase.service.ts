//app/services/firebase.service.ts
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { Observable, catchError, map } from 'rxjs';
import { Grupo } from '../models/grupo.model';
import { QueryConstraint, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private utilsSvc: UtilsService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth

  ) { }


  //AUTENTICACION FIREBASE
  getAuth() {
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

  // OBTENER TODOS LOS USUARIOS
  getAllUsers(): Observable<any[]> {
    const path = 'users';
    return this.getCollectionData(path);
  }

  // OBTENER UN USUARIO POR ID
  getUserById(userId: string) {
    return this.getDocument(`users/${userId}`);
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  singOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //BASE DE DATOS

  //CREAR UNA COLECCION
  async createCollection(path: string, data: any): Promise<any> {
    const firestore = getFirestore();
    const docRef = await addDoc(collection(firestore, path), data);
    return docRef;
  }

  //OBTENER UNA COLECCION
  getCollectionData(path: string, collectionQuery?: QueryConstraint[]): Observable<any[]> {
    const ref = collection(getFirestore(), path);

    if (collectionQuery) {
      return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
    } else {
      return collectionData(ref, { idField: 'id' });
    }
  }


  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //ACTUALIZAR UN DOCUMENTO
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //ELIMINAR UN DOCUMENTO
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //AGREGAR UN DOCUMENTO
  addDocument(path: string, data: any): Promise<any> {
    return addDoc(collection(getFirestore(), path), data);
  }

  //ALMACENAMIENTO DE DATOS

  //SUBIR IMAGEN
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }

  //OBTENER RUTA IMAGEN CON URL
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  //ELIMINAR ARCHIVOS
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

  //GRUPOS

  // OBTENER TODOS LOS GRUPOS
  getAllGroups(): Observable<Grupo[]> {
    const path = 'grupos';
    return this.getCollectionData(path);
  }

  // OBTENER UN GRUPO POR ID
  getGroupById(groupId: string) {
    const path = `grupos/${groupId}`;
    return this.getDocument(path);
  }

  // CREAR UN NUEVO GRUPO
  async createGroup(group: Grupo, user: User): Promise<any> {
    try {
      group.members = [user.uid];
      group.createdAt = new Date();
      const path = 'grupos';
      const { id, ...groupWithoutId } = group;
      return addDoc(collection(getFirestore(), path), groupWithoutId);

    } catch (error) {
      console.error('Error al crear el grupo:', error);
      throw error;
    }
  }

  //ACTUALIZAR UN GRUPO
  updateGroup(groupId: string, updatedGroup: Partial<Grupo>) {
    const path = `grupos/${groupId}`;
    return this.updateDocument(path, updatedGroup);
  }

  //ELIMINAR UN GRUPO
  deleteGroup(groupId: string) {
    const path = `grupos/${groupId}`;
    return this.deleteDocument(path);
  }

}
