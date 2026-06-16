import { _ as __nuxt_component_0$1 } from './nuxt-link-DU3zuAfP.mjs';
import { mergeProps, defineComponent, ref, withCtx, createVNode, createTextVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';
import 'vue-router';
import '@iconify/vue';

const _imports_0 = publicAssetsURL("/logo.svg");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Nav",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      { label: "Studio", to: "/studio" },
      { label: "Lavori", to: "/lavori" },
      { label: "Servizi", to: "/servizi" },
      { label: "Gallery", to: "/gallery" },
      { label: "Contatti", to: "/contatti" }
    ];
    const menuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "w-full border-b border-bc-black" }, _attrs))}><div class="flex items-center justify-between px-bc-page py-bc-xl">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3",
        onClick: ($event) => menuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Barbara Costantini Restauro" class="h-[30px] w-auto"${_scopeId}><span class="hidden lg:block font-garamond text-bc-body2 font-bold tracking-[0.02em]"${_scopeId}> Barbara Costantini Restauro </span>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Barbara Costantini Restauro",
                class: "h-[30px] w-auto"
              }),
              createVNode("span", { class: "hidden lg:block font-garamond text-bc-body2 font-bold tracking-[0.02em]" }, " Barbara Costantini Restauro ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden lg:flex items-center justify-between w-[676px]"><!--[-->`);
      ssrRenderList(links, (l) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: l.to,
          to: l.to,
          class: "font-sans text-bc-nav font-normal tracking-[0.02em] px-bc-md py-bc-sm hover:opacity-60 transition-opacity"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><button class="lg:hidden flex flex-col gap-[5px] p-2" aria-label="Menu"><span class="${ssrRenderClass([unref(menuOpen) ? "rotate-45 translate-y-[6px]" : "", "block w-[22px] h-px bg-bc-black transition-all"])}"></span><span class="${ssrRenderClass([unref(menuOpen) ? "opacity-0" : "", "block w-[22px] h-px bg-bc-black transition-all"])}"></span><span class="${ssrRenderClass([unref(menuOpen) ? "-rotate-45 -translate-y-[6px]" : "", "block w-[22px] h-px bg-bc-black transition-all"])}"></span></button></div>`);
      if (unref(menuOpen)) {
        _push(`<nav class="lg:hidden flex flex-col border-t border-bc-black"><!--[-->`);
        ssrRenderList(links, (l) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: l.to,
            to: l.to,
            class: "font-sans text-bc-nav font-normal tracking-[0.02em] px-bc-page py-bc-xl border-b border-bc-black/20 hover:opacity-60 transition-opacity",
            onClick: ($event) => menuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(l.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(l.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/Nav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "BcNav" });
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "w-full border-t border-bc-black mt-auto px-bc-page" }, _attrs))}><div class="mx-auto max-w-bc-content"><div class="flex flex-col items-center md:flex-row md:items-end md:justify-between py-bc-xl gap-bc-xl md:gap-0"><div class="flex flex-col gap-bc-xs text-center md:text-left"><p class="font-sans text-bc-nav font-bold text-bc-black tracking-[0.02em]"> Barbara Costantini Restauro Srl </p><div class="flex flex-col gap-[8px]"><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">P.IVA 14529501000</p><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">C.F. CSTBBR83M45H501C</p></div></div><div class="flex flex-col items-center md:items-end gap-[8px]"><div class="flex items-center gap-[6px]">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/cookie-policy",
    class: "font-sans text-bc-label2 font-light text-bc-black underline tracking-[0.02em]"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cookie Policy`);
      } else {
        return [
          createTextVNode("Cookie Policy")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="font-sans text-bc-label2 font-light text-bc-black">|</span>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/privacy-policy",
    class: "font-sans text-bc-label2 font-light text-bc-black underline tracking-[0.02em]"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Privacy Policy`);
      } else {
        return [
          createTextVNode("Privacy Policy")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em] text-center md:text-right"> © 2026, Barbara Costantini Restauro Srl · All Rights Reserved </p></div></div><div class="border-t border-bc-black/20"></div><div class="flex justify-center py-[16px]"><p class="font-sans text-bc-label2 font-light text-bc-black/60 text-center tracking-[0.02em]"> Energy Class A+ GreenMeter · Designed by Pianeta.studio </p></div></div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]), { __name: "BcFooter" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_BcNav = __nuxt_component_0;
  const _component_BcFooter = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-bc-canvas" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_BcNav, null, null, _parent));
  _push(`<main class="flex-1">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_BcFooter, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-BlRgbYQs.mjs.map
