<style>
  .loader {
    --size: 34px;
    width: var(--size);
    height: var(--size);
    display: inline-block;
    position: relative;
  }
  .loader::after,
  .loader::before {
    content: '';
    box-sizing: border-box;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    border: 2px solid rgb(100, 116, 139);
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  .loader::after {
    animation-delay: 1s;
  }

  @keyframes animloader {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>

<span class="loader" />
