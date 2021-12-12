<template>
  <div
    :class="value ? 'modal__show' : 'modal__hiddden'"
    class="modal"
    @click.self="closeDialog"
  >
    <div class="modal-content">
      <div class="modal-actions">
        <slot name="title">{{ title }}</slot>
        <span class="close" @click="closeDialog">&times;</span>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KDialog',

  props: {
    value: Boolean,
    title: String,
  },

  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}
.modal__show {
  display: block;
}
.modal__hiddden {
  display: none;
}


.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 50px;
  border: 1px solid #888;
  width: 40%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  text-decoration: none;
  color: black;
  cursor: pointer;
}
</style>
