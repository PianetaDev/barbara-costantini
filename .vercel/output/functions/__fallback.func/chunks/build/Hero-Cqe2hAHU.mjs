import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center gap-bc-xl lg:gap-bc-2xl py-bc-2xl lg:py-bc-4xl px-bc-page max-w-bc-wrap mx-auto" }, _attrs))}><h1 class="font-garamond text-[36px] md:text-[44px] lg:text-bc-h1 font-semibold text-center text-bc-black tracking-[0.02em] max-w-[908px]">`);
  ssrRenderSlot(_ctx.$slots, "title", {}, () => {
    _push(`Titolo Lorem Ipsum`);
  }, _push, _parent);
  _push(`</h1><div class="w-full max-w-[1142px] aspect-[1142/642] bg-bc-black/10 overflow-hidden">`);
  ssrRenderSlot(_ctx.$slots, "image", {}, () => {
    _push(`<img${ssrRenderAttr("src", "")} alt="" class="w-full h-full object-cover">`);
  }, _push, _parent);
  _push(`</div><p class="font-garamond text-bc-body1 font-normal text-center text-bc-black max-w-[440px]">`);
  ssrRenderSlot(_ctx.$slots, "subtext", {}, () => {
    _push(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.`);
  }, _push, _parent);
  _push(`</p></section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bc/Hero.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "BcHero" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Hero-Cqe2hAHU.mjs.map
