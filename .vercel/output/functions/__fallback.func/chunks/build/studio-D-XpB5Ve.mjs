import { _ as __nuxt_component_0 } from './Hero-Cqe2hAHU.mjs';
import { defineComponent, withCtx, createTextVNode, mergeProps, ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full border-t border-bc-black px-bc-page overflow-hidden" }, _attrs))}><div class="mx-auto max-w-bc-content flex flex-col md:flex-row md:items-center md:justify-between py-bc-2xl md:py-0 lg:h-[713px] gap-bc-xl md:gap-0"><div class="flex items-center md:flex-1 lg:flex-none lg:shrink-0 md:py-bc-2xl lg:py-bc-4xl"><div class="w-full lg:w-[443px] aspect-[443/553] bg-bc-black/10 overflow-hidden">`);
  ssrRenderSlot(_ctx.$slots, "image", {}, () => {
    _push(`<img${ssrRenderAttr("src", "")} alt="" class="w-full h-full object-cover">`);
  }, _push, _parent);
  _push(`</div></div><div class="hidden md:block self-stretch w-px bg-bc-black mx-bc-xl lg:mx-0 shrink-0"></div><div class="flex flex-col gap-bc-xl items-start md:flex-1 lg:flex-none lg:w-[442px] md:py-bc-2xl lg:py-0"><div class="flex flex-col gap-bc-md"><h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em] leading-[1.2]">`);
  ssrRenderSlot(_ctx.$slots, "nome", {}, () => {
    _push(`Barbara Costantini`);
  }, _push, _parent);
  _push(`</h2><p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]">`);
  ssrRenderSlot(_ctx.$slots, "ruolo", {}, () => {
    _push(`Ruolo`);
  }, _push, _parent);
  _push(`</p></div><p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">`);
  ssrRenderSlot(_ctx.$slots, "bio", {}, () => {
    _push(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.`);
  }, _push, _parent);
  _push(`</p></div></div></section>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/SectionBio.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]), { __name: "BcSectionBio" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SectionTeam",
  __ssrInlineRender: true,
  props: {
    membri: { default: () => [
      { nome: "Nome Cognome 1", ruolo: "Ruolo", bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula." },
      { nome: "Nome Cognome 2", ruolo: "Ruolo", bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula." },
      { nome: "Nome Cognome 3", ruolo: "Ruolo", bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula." }
    ] }
  },
  setup(__props) {
    const props = __props;
    const isMobile = ref(false);
    const carouselEl = ref();
    const startIndex = ref(0);
    const offset = ref(0);
    const visibleCount = computed(() => isMobile.value ? 1 : 2);
    const maxIndex = computed(() => Math.max(0, props.membri.length - visibleCount.value));
    watch(maxIndex, (max) => {
      if (startIndex.value > max) {
        startIndex.value = max;
        updateOffset();
      }
    });
    function cardWidth() {
      if (!carouselEl.value) return 0;
      const w = carouselEl.value.offsetWidth;
      const gap = 16;
      return visibleCount.value === 1 ? w : (w - gap) / 2;
    }
    function updateOffset() {
      offset.value = -(startIndex.value * (cardWidth() + 16));
    }
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full border-t border-bc-black px-bc-page overflow-hidden" }, _attrs))}><div class="hidden lg:flex lg:items-stretch mx-auto max-w-bc-content"><!--[-->`);
      ssrRenderList(__props.membri, (m, i) => {
        _push(`<!--[-->`);
        if (i > 0) {
          _push(`<div class="w-px bg-bc-black self-stretch shrink-0 mx-[40px]"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col gap-bc-xl flex-1 py-bc-4xl"><div class="w-full bg-bc-black/10 overflow-hidden" style="${ssrRenderStyle({ "aspect-ratio": "327/407" })}">`);
        if (m.image) {
          _push(`<img${ssrRenderAttr("src", m.image)}${ssrRenderAttr("alt", m.nome)} class="w-full h-full object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-bc-md"><div class="flex flex-col gap-[4px]"><h3 class="font-garamond text-[32px] leading-[1.2] font-semibold text-bc-black tracking-[0.02em]">${ssrInterpolate(m.nome)}</h3><p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]">${ssrInterpolate(m.ruolo)}</p></div><p class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em]">${ssrInterpolate(m.bio)}</p></div></div><!--]-->`);
      });
      _push(`<!--]--></div><div class="lg:hidden mx-auto max-w-bc-content py-bc-2xl"><div class="flex flex-col gap-bc-md"><div class="flex justify-end items-center gap-bc-md"><button class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity disabled:opacity-25"${ssrIncludeBooleanAttr(unref(startIndex) === 0) ? " disabled" : ""}>Previous</button><span class="font-garamond text-bc-body2 text-bc-black">/</span><button class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity disabled:opacity-25"${ssrIncludeBooleanAttr(unref(startIndex) >= unref(maxIndex)) ? " disabled" : ""}>Next</button></div><div class="overflow-hidden"><div class="flex gap-[16px] items-start transition-transform duration-500 ease-out" style="${ssrRenderStyle({ transform: `translateX(${unref(offset)}px)` })}"><!--[-->`);
      ssrRenderList(__props.membri, (m, i) => {
        _push(`<div class="flex-none flex flex-col gap-bc-xl w-full md:w-[calc(50%-8px)]"><div class="w-full bg-bc-black/10 overflow-hidden" style="${ssrRenderStyle({ "aspect-ratio": "327/407" })}">`);
        if (m.image) {
          _push(`<img${ssrRenderAttr("src", m.image)}${ssrRenderAttr("alt", m.nome)} class="w-full h-full object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-bc-md"><div class="flex flex-col gap-[4px]"><h3 class="font-garamond text-[32px] leading-[1.2] font-semibold text-bc-black tracking-[0.02em]">${ssrInterpolate(m.nome)}</h3><p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]">${ssrInterpolate(m.ruolo)}</p></div><p class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em]">${ssrInterpolate(m.bio)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/SectionTeam.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "BcSectionTeam" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "studio",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Lo Studio — Barbara Costantini Restauro" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BcHero = __nuxt_component_0;
      const _component_BcSectionBio = __nuxt_component_1;
      const _component_BcSectionTeam = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BcHero, null, {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Lo studio`);
          } else {
            return [
              createTextVNode("Lo studio")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BcSectionBio, null, null, _parent));
      _push(ssrRenderComponent(_component_BcSectionTeam, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=studio-D-XpB5Ve.mjs.map
