import { _ as __nuxt_component_0 } from './Hero-Cqe2hAHU.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DU3zuAfP.mjs';
import { defineComponent, mergeProps, withCtx, renderSlot, createTextVNode, ref, computed, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
import 'vue-router';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$3 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full border-t border-b border-bc-black px-bc-page overflow-hidden" }, _attrs))}><div class="mx-auto max-w-bc-content flex flex-col md:flex-row md:items-center md:justify-between py-bc-2xl md:py-0 lg:h-[713px] gap-bc-xl md:gap-0"><div class="flex flex-col gap-bc-xl items-start justify-center md:flex-1 lg:flex-none lg:w-[442px] md:py-bc-2xl lg:py-0"><div class="flex flex-col gap-bc-xl"><h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">`);
  ssrRenderSlot(_ctx.$slots, "title", {}, () => {
    _push(`Lo studio`);
  }, _push, _parent);
  _push(`</h2><p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">`);
  ssrRenderSlot(_ctx.$slots, "body", {}, () => {
    _push(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.`);
  }, _push, _parent);
  _push(`</p></div>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/studio",
    class: "bc-btn"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "cta", {}, () => {
          _push2(`Scopri lo studio`);
        }, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "cta", {}, () => [
            createTextVNode("Scopri lo studio")
          ])
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(`</div><div class="hidden md:block self-stretch w-px bg-bc-black mx-bc-xl lg:mx-bc-2xl shrink-0"></div><div class="flex items-center md:flex-1 lg:flex-none md:py-bc-2xl lg:py-bc-4xl"><div class="w-full lg:w-[443px] aspect-[443/553] bg-bc-black/10 overflow-hidden">`);
  ssrRenderSlot(_ctx.$slots, "image", {}, () => {
    _push(`<img${ssrRenderAttr("src", "")} alt="Lo studio" class="w-full h-full object-cover">`);
  }, _push, _parent);
  _push(`</div></div></div></section>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/SectionStudio.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]), { __name: "BcSectionStudio" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SectionLavori",
  __ssrInlineRender: true,
  props: {
    progetti: { default: () => [
      { codice: "PRJ01", committente: "Committente", titolo: "Nome progetto", slug: "progetto-1", tipo: "vertical" },
      { codice: "PRJ02", committente: "Committente", titolo: "Nome progetto", slug: "progetto-2", tipo: "horizontal" },
      { codice: "PRJ03", committente: "Committente", titolo: "Nome progetto", slug: "progetto-3", tipo: "vertical" }
    ] }
  },
  setup(__props) {
    const props = __props;
    ref();
    const startIndex = ref(0);
    const offset = ref(0);
    const maxIndex = computed(() => Math.max(0, props.progetti.length - 2));
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full border-b border-bc-black px-bc-page overflow-hidden" }, _attrs))}><div class="mx-auto max-w-bc-content flex flex-col md:flex-row md:items-start gap-bc-xl md:gap-bc-2xl lg:gap-0 lg:justify-between py-bc-2xl lg:py-bc-4xl lg:items-center"><div class="flex flex-col gap-bc-xl items-start md:shrink-0 md:w-[240px] lg:w-[327px]"><div class="flex flex-col gap-bc-xl"><h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">I lavori</h2><p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/lavori",
        class: "bc-btn"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Esplora i lavori`);
          } else {
            return [
              createTextVNode("Esplora i lavori")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden lg:flex gap-[24px] items-end"><!--[-->`);
      ssrRenderList(__props.progetti, (p) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: p.slug,
          to: `/lavori/${p.slug}`,
          class: ["flex flex-col gap-bc-md items-start group", p.tipo === "horizontal" ? "w-[210px]" : "w-[209px]"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass([p.tipo === "horizontal" ? "aspect-[209/139]" : "aspect-[209/260]", "relative w-full overflow-hidden bg-bc-black/10"])}"${_scopeId}>`);
              if (p.image) {
                _push2(`<img${ssrRenderAttr("src", p.image)}${ssrRenderAttr("alt", p.titolo)} class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex flex-col gap-[4px]"${_scopeId}><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.codice)}</p><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.committente)}</p><p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.titolo)}</p></div>`);
            } else {
              return [
                createVNode("div", {
                  class: ["relative w-full overflow-hidden bg-bc-black/10", p.tipo === "horizontal" ? "aspect-[209/139]" : "aspect-[209/260]"]
                }, [
                  p.image ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: p.image,
                    alt: p.titolo,
                    class: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                ], 2),
                createVNode("div", { class: "flex flex-col gap-[4px]" }, [
                  createVNode("p", { class: "font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]" }, toDisplayString(p.codice), 1),
                  createVNode("p", { class: "font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]" }, toDisplayString(p.committente), 1),
                  createVNode("p", { class: "font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]" }, toDisplayString(p.titolo), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="lg:hidden flex flex-col gap-bc-md flex-1 min-w-0"><div class="flex justify-end items-center gap-bc-md"><button class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity disabled:opacity-25"${ssrIncludeBooleanAttr(unref(startIndex) === 0) ? " disabled" : ""}>Previous</button><span class="font-garamond text-bc-body2 text-bc-black">/</span><button class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity disabled:opacity-25"${ssrIncludeBooleanAttr(unref(startIndex) >= unref(maxIndex)) ? " disabled" : ""}>Next</button></div><div class="overflow-hidden"><div class="flex gap-[16px] items-end transition-transform duration-500 ease-out" style="${ssrRenderStyle({ transform: `translateX(${unref(offset)}px)` })}"><!--[-->`);
      ssrRenderList(__props.progetti, (p) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: p.slug,
          to: `/lavori/${p.slug}`,
          class: "flex-none flex flex-col gap-bc-md items-start group w-[calc(50%-8px)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative w-full overflow-hidden bg-bc-black/10 aspect-[3/4]"${_scopeId}>`);
              if (p.image) {
                _push2(`<img${ssrRenderAttr("src", p.image)}${ssrRenderAttr("alt", p.titolo)} class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex flex-col gap-[4px]"${_scopeId}><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.codice)}</p><p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.committente)}</p><p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]"${_scopeId}>${ssrInterpolate(p.titolo)}</p></div>`);
            } else {
              return [
                createVNode("div", { class: "relative w-full overflow-hidden bg-bc-black/10 aspect-[3/4]" }, [
                  p.image ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: p.image,
                    alt: p.titolo,
                    class: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col gap-[4px]" }, [
                  createVNode("p", { class: "font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]" }, toDisplayString(p.codice), 1),
                  createVNode("p", { class: "font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]" }, toDisplayString(p.committente), 1),
                  createVNode("p", { class: "font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]" }, toDisplayString(p.titolo), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/SectionLavori.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "BcSectionLavori" });
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full px-bc-page overflow-hidden" }, _attrs))}><div class="mx-auto max-w-bc-content flex flex-col md:flex-row md:items-center md:justify-between py-bc-2xl md:py-0 lg:h-[713px] gap-bc-xl md:gap-0"><div class="flex items-center md:flex-1 lg:flex-none lg:shrink-0 md:py-bc-2xl lg:py-bc-4xl"><div class="w-full lg:w-[442px] aspect-[442/553] bg-bc-black/10 overflow-hidden">`);
  ssrRenderSlot(_ctx.$slots, "image", {}, () => {
    _push(`<img${ssrRenderAttr("src", "")} alt="I servizi" class="w-full h-full object-cover">`);
  }, _push, _parent);
  _push(`</div></div><div class="hidden md:block self-stretch w-px bg-bc-black mx-bc-xl lg:mx-0 shrink-0"></div><div class="flex flex-col gap-bc-xl items-start md:flex-1 lg:flex-none lg:w-[437px] md:py-bc-2xl lg:py-0"><div class="flex flex-col gap-bc-xl"><h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">`);
  ssrRenderSlot(_ctx.$slots, "title", {}, () => {
    _push(`I servizi`);
  }, _push, _parent);
  _push(`</h2><p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">`);
  ssrRenderSlot(_ctx.$slots, "body", {}, () => {
    _push(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.`);
  }, _push, _parent);
  _push(`</p></div>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/servizi",
    class: "bc-btn"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "cta", {}, () => {
          _push2(`Scopri i servizi`);
        }, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "cta", {}, () => [
            createTextVNode("Scopri i servizi")
          ])
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(`</div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/SectionServizi.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "BcSectionServizi" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Barbara Costantini Restauro" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BcHero = __nuxt_component_0;
      const _component_BcSectionStudio = __nuxt_component_1;
      const _component_BcSectionLavori = __nuxt_component_2;
      const _component_BcSectionServizi = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BcHero, null, null, _parent));
      _push(ssrRenderComponent(_component_BcSectionStudio, null, null, _parent));
      _push(ssrRenderComponent(_component_BcSectionLavori, null, null, _parent));
      _push(ssrRenderComponent(_component_BcSectionServizi, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ovgzBX-q.mjs.map
