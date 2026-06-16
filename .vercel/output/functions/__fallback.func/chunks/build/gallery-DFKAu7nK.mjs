import { _ as __nuxt_component_0$1 } from './nuxt-link-DU3zuAfP.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useHead } from './v4-CqufY2om.mjs';
import '../nitro/nitro.mjs';
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
import './server.mjs';
import 'vue-router';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SectionGallery",
  __ssrInlineRender: true,
  props: {
    progetti: { default: () => [
      // Row 1: V H V H
      { codice: "PRJ01", committente: "Committente", titolo: "Nome progetto", slug: "prj-01", tipo: "vertical" },
      { codice: "PRJ02", committente: "Committente", titolo: "Nome progetto", slug: "prj-02", tipo: "horizontal" },
      { codice: "PRJ03", committente: "Committente", titolo: "Nome progetto", slug: "prj-03", tipo: "vertical" },
      { codice: "PRJ04", committente: "Committente", titolo: "Nome progetto", slug: "prj-04", tipo: "horizontal" },
      // Row 2: H V V H
      { codice: "PRJ05", committente: "Committente", titolo: "Nome progetto", slug: "prj-05", tipo: "horizontal" },
      { codice: "PRJ06", committente: "Committente", titolo: "Nome progetto", slug: "prj-06", tipo: "vertical" },
      { codice: "PRJ07", committente: "Committente", titolo: "Nome progetto", slug: "prj-07", tipo: "vertical" },
      { codice: "PRJ08", committente: "Committente", titolo: "Nome progetto", slug: "prj-08", tipo: "horizontal" },
      // Row 3: H H V V
      { codice: "PRJ09", committente: "Committente", titolo: "Nome progetto", slug: "prj-09", tipo: "horizontal" },
      { codice: "PRJ10", committente: "Committente", titolo: "Nome progetto", slug: "prj-10", tipo: "horizontal" },
      { codice: "PRJ11", committente: "Committente", titolo: "Nome progetto", slug: "prj-11", tipo: "vertical" },
      { codice: "PRJ12", committente: "Committente", titolo: "Nome progetto", slug: "prj-12", tipo: "vertical" }
    ] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full px-bc-page py-bc-4xl" }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-bc-2xl items-start"><!--[-->`);
      ssrRenderList(__props.progetti, (p) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: p.slug,
          to: `/gallery/${p.slug}`,
          class: "flex flex-col gap-[16px] group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-full bg-bc-black/10 overflow-hidden" style="${ssrRenderStyle(p.tipo === "vertical" ? "aspect-ratio: 326/406" : "aspect-ratio: 326/217")}"${_scopeId}>`);
              if (p.image) {
                _push2(`<img${ssrRenderAttr("src", p.image)}${ssrRenderAttr("alt", p.titolo)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex flex-col gap-[4px]"${_scopeId}><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]"${_scopeId}>${ssrInterpolate(p.codice)}</p><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]"${_scopeId}>${ssrInterpolate(p.committente)}</p><p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.titolo)}</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: "w-full bg-bc-black/10 overflow-hidden",
                  style: p.tipo === "vertical" ? "aspect-ratio: 326/406" : "aspect-ratio: 326/217"
                }, [
                  p.image ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: p.image,
                    alt: p.titolo,
                    class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                ], 4),
                createVNode("div", { class: "flex flex-col gap-[4px]" }, [
                  createVNode("p", { class: "font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]" }, toDisplayString(p.codice), 1),
                  createVNode("p", { class: "font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]" }, toDisplayString(p.committente), 1),
                  createVNode("p", { class: "font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]" }, toDisplayString(p.titolo), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/SectionGallery.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "BcSectionGallery" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gallery",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Gallery — Barbara Costantini Restauro" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BcSectionGallery = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="w-full border-b border-bc-black px-bc-page py-bc-4xl"><div class="mx-auto max-w-[908px] flex flex-col items-center gap-bc-2xl text-center"><h1 class="font-garamond text-[36px] md:text-[44px] lg:text-bc-h1 font-semibold text-bc-black tracking-[0.02em] leading-[1.2]"> Gallery fotografica </h1><p class="font-garamond text-bc-sub font-normal text-bc-black tracking-[0.02em] max-w-[438px]"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. </p></div></section>`);
      _push(ssrRenderComponent(_component_BcSectionGallery, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=gallery-DFKAu7nK.mjs.map
