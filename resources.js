// resources.js - единый для всех страниц
import {
    auth,
    db,
    storage,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "./firebase.js";

// Загрузка всех материалов
export async function getAllMaterials() {
    try {
        const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const materials = [];
        
        snapshot.forEach(doc => {
            materials.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return materials;
    } catch (error) {
        console.error("Ошибка загрузки материалов:", error);
        return [];
    }
}

// Загрузка материалов пользователя
export async function getUserMaterials(userId) {
    try {
        const q = query(
            collection(db, "resources"), 
            where("uploadedBy", "==", userId)
        );
        const snapshot = await getDocs(q);
        const materials = [];
        
        snapshot.forEach(doc => {
            materials.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return materials;
    } catch (error) {
        console.error("Ошибка загрузки материалов пользователя:", error);
        return [];
    }
}

// Загрузка избранного
export async function getUserFavorites(userId) {
    try {
        const q = query(
            collection(db, "users", userId, "favorites")
        );
        const snapshot = await getDocs(q);
        const favorites = [];
        
        snapshot.forEach(doc => {
            favorites.push({
                favoriteId: doc.id,
                ...doc.data()
            });
        });
        
        return favorites;
    } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        return [];
    }
}

// Добавить в избранное
export async function addToFavorites(userId, resourceId, resourceData) {
    try {
        await setDoc(doc(db, "users", userId, "favorites", resourceId), {
            ...resourceData,
            favoritedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Ошибка добавления в избранное:", error);
        return false;
    }
}

// Удалить из избранного
export async function removeFromFavorites(userId, resourceId) {
    try {
        await deleteDoc(doc(db, "users", userId, "favorites", resourceId));
        return true;
    } catch (error) {
        console.error("Ошибка удаления из избранного:", error);
        return false;
    }
}

// Загрузить материал
export async function uploadResource(file, data, userId) {
    try {
        // 1. Загружаем файл в Storage
        const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // 2. Сохраняем данные в Firestore
        const resourceData = {
            title: data.title,
            subject: data.subject,
            class: data.class,
            format: data.format,
            description: data.description || "",
            fileUrl: downloadURL,
            filePath: storageRef.fullPath,
            uploadedBy: userId,
            uploadedByName: data.userName || "Аноним",
            createdAt: serverTimestamp(),
            views: 0,
            downloads: 0
        };
        
        const docRef = await addDoc(collection(db, "resources"), resourceData);
        
        return {
            success: true,
            id: docRef.id,
            ...resourceData
        };
    } catch (error) {
        console.error("Ошибка загрузки ресурса:", error);
        return { success: false, error: error.message };
    }
}

// Удалить материал
export async function deleteResource(resourceId, filePath) {
    try {
        // 1. Удаляем из Firestore
        await deleteDoc(doc(db, "resources", resourceId));
        
        // 2. Удаляем файл из Storage
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
        
        // 3. Удаляем из избранного у всех пользователей
        // Для этого нужно удалить из всех подколлекций favorites
        // (опционально, можно реализовать позже)
        
        return true;
    } catch (error) {
        console.error("Ошибка удаления ресурса:", error);
        return false;
    }
}

// Отправить сообщение админу
export async function sendMessageToAdmin(userId, userEmail, message) {
    try {
        await addDoc(collection(db, "messages"), {
            userId: userId,
            userEmail: userEmail,
            message: message,
            createdAt: serverTimestamp(),
            read: false
        });
        return true;
    } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
        return false;
    }
}