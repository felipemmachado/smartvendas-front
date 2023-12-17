<template>
<div>
  <div class="bk" :class="$q.dark.isActive ? 'bk-dark' : 'bk-light'">
    <div class="box">
      <div class="logo-mobile">
        <img v-if="!$q.dark.isActive"
          class="animated fadeIn"
          src="../../assets/imagens/logo_sistema.png" />
        <img v-if="$q.dark.isActive"
          class="animated fadeIn"
          src="../../assets/imagens/logo_negativa.png" />
      </div>
      <div class="form" :class="$q.dark.isActive ? 'form-dark' : 'form-light'">

        <div class="logo-desktop animated fadeInUp">
          <img v-if="$q.dark.isActive" src="../../assets/imagens/logo_negativa.png" />
          <img v-if="!$q.dark.isActive" src="../../assets/imagens/logo_sistema.png" />
        </div>

        <router-view></router-view>
      </div>
    </div>
  </div>
</div>

</template>

<style lang="scss">

.form-light {
  background-color: rgb(245, 245, 245);
}

.form-dark {
  background-color: #121212;
}

@media only screen and (max-width: 1023px) {
  .bk::before {
    content : "";
    display: block;
    position: absolute;
    background-repeat: repeat-x;
    width: 100%;
    height: 150px;
    z-index: -1;
    background-image: url('../../assets/imagens/495.jpg');
  }

  .bk-light::before {
    filter: opacity(20%);
  }

  .bk-dark::before {
    filter: invert(100%) opacity(9%);
  }

  .box {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    flex-direction: column;
  }

  .logo-mobile {
    text-align: center;
    padding-bottom: 0em;
    padding-top: 1.5em;

    img {
      width: 180px;
    }
  }

  .logo-desktop {
    display: none;
  }

  .form {
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: 6px;
    margin: 1em;
    max-width: 370px;
    width: 100%;
  }

  .logo-pc {
    display: none;
  }

}

@media only screen and (min-width: 1024px) {

  .bk::before {
    content : "";
    display: block;
    position: absolute;
    background-image: url('../../assets/imagens/495.jpg');
    background-position: 0px;
    width: 100%;
    height: 100vh;
    z-index: -1;
    filter: opacity(20%);
  }

  .box {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    flex-direction: column;
  }

  .logo-mobile {
    display: none;
  }

  .logo-desktop {
    margin-bottom: 70px;
    text-align: center;
    img {
      width: 250px !important;
    }
  }

  .form {
    height: 100vh;
    width: 30%;
    display: flex;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
  }

  .logo-pc {
    width: 50px;
    margin-bottom: 1em;
  }
}

@media only screen and (min-width: 1600px) {
  .form {
    width: 25% !important;
  }
}
</style>
