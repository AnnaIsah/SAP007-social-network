import {
  removePost, editPost, likePost, removeLikePost,
} from '../pages/feed/firestore-functions.js';

export function postElement(post, uid) {
  let numberLikes = post.like.length;
  const date = new Date(post.day.seconds * 1000);
  const timelinePost = document.createElement('div');
  timelinePost.setAttribute('class', 'box-post flex column');
  timelinePost.innerHTML = `
    <div class="informations-user flex">
      <div class="photo-name-post flex">
        <figure class="post-img-user" ><img class="post-img-user" src="${post.imgProfile}" alt="user"></figure>
        <div class="name-modified-status flex column">
          <p class="post-name-user">${post.name}</p>
          <div class="message-modified-post">
            <p class="post-modified" id="post-modified">${post.edit}</p>
          </div>
        </div>
      </div> 
      <nav class="nav-remove-modify flex">
      </nav>
    </div>
    <div class="post-text-id flex column">
      <p class="post-date">${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}</p>
      <p class="post-text" id="post-text">${post.message}</p>
    </div>
    <div class="like-comment flex">
      <button class="post-like btn-config"><p class="value-like">${numberLikes}</p><img src="../img/iconeLike.png" alt="Botão like" class="btn-like-post">Curtir</button>
      <button class="post-comment btn-config"><img src="../img/iconeBalao.png" alt="Botão comentar" class="bnt-comment-post">Comentar</button>
    </div>`;

  const btnLike = timelinePost.querySelector('.post-like');
  const paragraphLikeValue = timelinePost.querySelector('.value-like');

  btnLike.addEventListener('click', () => {
    if (numberLikes === 0) {
      console.log('oi adicionei');
      likePost(post.idPost, uid).then(() => {
        numberLikes += 1;
        paragraphLikeValue.textContent = `${numberLikes}`;
      }).catch((e) => console.log(e));
    } else {
      post.like.forEach((user) => {
        if (user === uid) {
          console.log('oi exclui');
          removeLikePost(post.idPost, uid).then(() => {
            numberLikes -= 1;
            paragraphLikeValue.textContent = `${numberLikes}`;
          }).catch((e) => console.log(e));
        } else {
          console.log('oi adicionei');
          likePost(post.idPost, uid).then(() => {
            numberLikes += 1;
            paragraphLikeValue.textContent = `${numberLikes}`;
          }).catch((e) => console.log(e));
        }
      });
    }
  });

  const navRemoveModifie = timelinePost.querySelector('.nav-remove-modify');
  const mainPost = timelinePost.querySelector('.post-text-id');

  const modifyForm = document.createElement('form');
  modifyForm.setAttribute('class', 'form-modify-post');
  modifyForm.innerHTML = `
  <div class="content-edit-post flex">
    <textarea class="modify-input-value">
    </textarea>
    <button class="confirm-modify btn-edit-style">Confirmar Editar</button>
    <button class="close-modify btn-edit-style">Cancelar Editar</button>
  </div>
  `;
  // const modal com template do modal de excluir
  const modalDelete = document.createElement('div');
  modalDelete.setAttribute('class', 'modal-delete');
  modalDelete.innerHTML = `
  <div class="modal-delete-confirm">
    <h3>Você tem certeza que deseja excluir essa postagem?</h3>
    <button class="confirm-delete style-delete">Confirmar</button>
    <button class="close-delete style-delete">Cancelar</button>
  </div>
  `;
  // aqui será o menu de configurações que só aparece pro usuário dono do post
  if (uid === post.userUid) {
    timelinePost.appendChild(modalDelete);
    mainPost.appendChild(modifyForm);
    navRemoveModifie.innerHTML = `
    <button class="meatball-menu flex">
      <span id="balls" class="balls"></span>
      <span id="balls" class="balls"></span>
      <span id="balls" class="balls"></span>
    </button>
    <div class="menu-edit-remove">
      <ul class="configs-posts">
        <li class="btn-config"><button class="btn-config remove"><img src="../img/iconeLixeira.png" alt="Icone remover post" class="img-delete"></button></li>
        <li class="btn-config"><button class="modify btn-config"><img src="../img/iconeEditar.png" alt="Icone editar post" class="img-edit"></button></li>
      </ul> 
    </div>  `;

    const btnRemove = timelinePost.querySelector('.remove');
    const btnEdit = timelinePost.querySelector('.modify');
    const btnCancelEdit = timelinePost.querySelector('.close-modify');
    const btnConfirmEdit = timelinePost.querySelector('.confirm-modify');
    const inputModify = timelinePost.querySelector('.modify-input-value');
    const btnMenu = timelinePost.querySelector('.meatball-menu');
    const menuEditRemove = timelinePost.querySelector('.menu-edit-remove');
    const btnDeletePost = timelinePost.querySelector('.confirm-delete');
    const btnCancelDeletePost = timelinePost.querySelector('.close-delete');

    btnMenu.addEventListener('click', () => {
      menuEditRemove.classList.toggle('active');
    });

    btnEdit.addEventListener('click', () => {
      modifyForm.style.display = 'block';
      inputModify.value = timelinePost.querySelector('#post-text').textContent;
      menuEditRemove.classList.toggle('active');
    });

    btnCancelEdit.addEventListener('click', (e) => {
      e.preventDefault();
      inputModify.value = '';
      modifyForm.style.display = 'none';
    });

    btnConfirmEdit.addEventListener('click', (e) => {
      e.preventDefault();
      if (inputModify.value !== post.message && inputModify.value.trim().length !== 0) {
        editPost(post.idPost, inputModify.value)
          .then(() => {
            timelinePost.querySelector('#post-text').textContent = inputModify.value;
            inputModify.value = '';
            modifyForm.style.display = 'none';
            timelinePost.querySelector('#post-modified').textContent = 'Editado';
          }).catch((error) => console.log(error));
      } else {
        inputModify.value = '';
        modifyForm.style.display = 'none';
      }
    });

    btnRemove.addEventListener('click', () => {
      modalDelete.style.display = 'block';
    });
    btnDeletePost.addEventListener('click', (e) => {
      e.preventDefault();
      removePost(post.idPost).then(() => {
        timelinePost.innerHTML = '';
      }).catch((error) => console.log(error));
    });

    btnCancelDeletePost.addEventListener('click', (e) => {
      e.preventDefault();
      modalDelete.value = '';
      modalDelete.style.display = 'none';
    });
  }
  return timelinePost;
}
