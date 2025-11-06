/**
 * 视频生成提示词模板系统
 *
 * 提供标准化的提示词生成功能，确保生成的视频符合外卖平台规范
 */

/**
 * 视频提示词模板
 * 将用户输入的品类动态插入到提示词中
 *
 * @param category - 店铺经营品类（如：盖浇饭炒菜、奶茶、烧烤等）
 * @returns 完整的视频生成提示词
 *
 * @example
 * ```ts
 * const prompt = VIDEO_PROMPT_TEMPLATE('盖浇饭炒菜')
 * // 返回：展示盖浇饭炒菜��食的精美画面...
 * ```
 */
export const VIDEO_PROMPT_TEMPLATE = (category: string): string => {
  // 对输入进行基础验证和清理
  const cleanCategory = category.trim()

  if (!cleanCategory) {
    throw new Error('品类不能为空')
  }

  return `展示${cleanCategory}美食的精美画面，突出食物的色泽、质感和诱人外观，适合用作外卖店铺的视频招牌，背景干净简洁，光线明亮温暖，特写镜头展示食物细节，整体氛围温馨诱人。横屏格式视频。`
}

/**
 * 首尾帧视频提示词模板
 * 从完整食物过渡到爆炸分层图的动画效果
 *
 * @returns 首尾帧过渡动画的视频生成提示词
 *
 * @example
 * ```ts
 * const prompt = FIRST_LAST_FRAME_VIDEO_PROMPT()
 * // 配合首图和尾图使用，生成分解动画
 * ```
 */
export const FIRST_LAST_FRAME_VIDEO_PROMPT = (): string => {
  return `Create a smooth animated transition from a complete assembled food dish to an exploded/deconstructed view showing all ingredients separated and floating in vertical layers.

ANIMATION CONCEPT:
Transform the food from its assembled state (first frame) into a vertical exploded diagram (final frame) where each ingredient layer gradually separates and floats upward, creating an educational yet visually stunning deconstruction animation.

CAMERA SETUP:
- PHASE 1 (0-2 seconds): Fast forward zoom - camera rapidly pushes in from medium distance to extreme close-up with smooth acceleration
- PHASE 2 (2-8 seconds): FIXED POSITION - camera locked in close-up position, no further movement
- Static frontal view maintaining perfect center framing throughout
- Food remains centered in frame during entire animation
- 16:9 horizontal landscape orientation

ANIMATION SEQUENCE (8 seconds total):

PHASE 1 - Rapid Camera Push-In (0-2 seconds):
- Camera starts at medium distance showing full assembled food dish
- Fast forward zoom motion - camera rapidly accelerates toward food
- Zoom speed: Start at medium pace (0-1 sec), then accelerate to fast (1-2 sec)
- By 2 seconds, camera reaches extreme close-up position and locks
- Food appears complete and assembled throughout this phase
- Smooth motion blur during rapid zoom creating cinematic feel

PHASE 2 - Golden Particle Appearance (2-2.8 seconds):
- Camera now locked at close-up position (no more camera movement)
- Hundreds of small glowing PURE GOLDEN YELLOW spheres materialize above the food
- Particles appear gradually: start with 10-20, quickly multiply to 200-300 particles
- Particles orbit in circular patterns above and around the food (15-25cm radius from food center)
- Each particle emits bright warm GOLDEN YELLOW light with soft glow
- Particles move in smooth curved spiral paths at medium speed
- Golden light from particles illuminates the food from above, creating warm highlights
- Food remains assembled during this phase, bathed in golden particle glow
- Particles leave short glowing golden light trails as they move

PHASE 2.5 - Particle Fade Out (2.8-3.2 seconds):
- Golden particles gradually fade out and disappear
- Particles dissolve with gentle fade effect (opacity reducing from 100% to 0%)
- Some particles drift upward while fading, others drift outward
- By 3.2 seconds, all golden particles have completely disappeared
- Food remains assembled and clearly visible without particle obstruction
- Lighting returns to normal food photography lighting

PHASE 3 - Food Deconstruction (3.2-6 seconds):
- NO golden particles present (they have completely faded out)
- Food now begins separating into exploded layer view
- Ingredients begin separating vertically in their natural stacking order
- Bottom layer (base container - bowl/plate/bottom bun) remains stationary or drops slightly
- Each subsequent layer rises upward at different speeds creating cascading effect
- Separation happens smoothly with ease-in-ease-out motion (not sudden jumps)
- Gaps between layers gradually increase from 0cm to 2-5cm final spacing
- All layers maintain perfect vertical center alignment throughout separation
- Clean, clear exploded view without any particle effects
- By 6 seconds, all ingredients reach final floating positions in exploded diagram
- Gentle floating motion - each layer bobbing slightly (±1-2mm) as if suspended in air

PHASE 4 - Food Reassembly (6-8 seconds):
- All separated layers begin smoothly moving back together
- Layers descend and converge back to their original assembled positions
- Top layers move down first, followed by middle layers, creating reverse cascading effect
- Each layer moves with smooth ease-in-ease-out motion (not sudden drops)
- Gaps between layers gradually decrease from 2-5cm back to 0cm (fully assembled)
- All layers maintain perfect vertical center alignment during reassembly
- Movement speed increases slightly as layers approach their final positions (gentle acceleration)
- By 8 seconds, food is completely reassembled into its original whole form
- Final assembled state matches the starting appearance (first frame)
- Food settles gently with subtle bounce/settling motion upon full reassembly

INGREDIENT-SPECIFIC MOTION DYNAMICS:

For SOLID LAYERS (buns, patties, cake layers):
- Smooth vertical rising motion
- Slight rotation (±5 degrees) during ascent adding dynamism
- Very subtle wobble upon reaching final position

For FLEXIBLE INGREDIENTS (lettuce, vegetables, thin items):
- Rising with gentle swaying motion (left-right ±10 degrees)
- Leaves flutter slightly in simulated air current
- More pronounced organic movement than solid layers

For LIQUID/SAUCE LAYERS:
- Rising with surface rippling and flowing
- Slight bounce/jiggle motion showing liquid physics
- Droplets may separate and float nearby

For SMALL ITEMS (toppings, garnish, seeds):
- Some items rise faster, some slower creating variety
- Slight tumbling/rotating motion during ascent
- Small items may drift slightly off-center (±2-3cm) before returning

For CHEESE/STRETCHY ITEMS:
- Brief stretching effect during separation showing elasticity
- Cheese may show slight melting/drooping at edges
- Returns to solid shape once separated

LAYERING ORDER EXAMPLES:

BURGERS/SANDWICHES (bottom to top separation):
1. Bottom bun (stays low or drops slightly)
2. Bottom patty rises first
3. Cheese layer rises
4. Additional patties (if present)
5. Vegetables (tomatoes bounce, lettuce sways)
6. Sauces float upward
7. Top bun rises highest

BOWLS/RICE DISHES (bottom to top):
1. Empty bowl (remains stationary)
2. Rice/noodle base rises
3. Protein (meat/tofu) rises with slight rotation
4. Vegetables separate and sway
5. Sauce layer with rippling effect
6. Garnish floats to top

BACKGROUND EFFECTS:

GOLDEN PARTICLE SYSTEM (PHASE 2 ONLY - 2.0 to 3.2 seconds):
- 200-300 small glowing PURE GOLDEN YELLOW spheres orbiting the food
- Particles size: 3-8mm diameter, varying sizes for depth
- Orbital motion: Smooth curved spiral paths around food center
- Movement speed: Medium-fast, creating dynamic flowing effect
- Light emission: Each particle glows with warm golden yellow light (NOT blue, NOT purple)
- Light trails: Short glowing golden streaks following particle motion (fade after 0.3 seconds)
- Particle lifecycle: Appear at 2.0 sec, orbit until 2.8 sec, then fade out completely by 3.2 sec
- Illumination effect: Golden particles cast warm highlights on food surfaces from above
- Depth layering: Particles move in 3D space, some in front of food, some behind
- IMPORTANT: Particles completely disappear before food deconstruction begins (Phase 3)

OIL SPLASH PARTICLES (PHASE 3 ONLY - During Deconstruction):
- Small golden oil droplets spray outward from food during ingredient separation
- Droplets arc through air in realistic parabolic trajectories
- 15-20 visible droplets, size 2-4mm diameter
- Droplets catch light creating subtle sparkle effect
- Some droplets splash against invisible boundary and bounce back
- Warm orange/golden color matching food lighting
- Oil droplets appear naturally as ingredients separate (NOT the magical golden particles)
- Liquid-like physics: heavier, slower motion compared to magical particles

BACKGROUND GRADIENT:
- Clean solid color background (warm orange, amber, or beige)
- Subtle vignette darkening at frame edges
- Slight blur/glow behind floating ingredients enhancing depth
- Background color matches the original food photography style

LIGHTING:
- Consistent warm professional food photography lighting (3200K)
- Soft shadows beneath each floating layer showing depth
- Light catches ingredient surfaces emphasizing textures
- Highlights on oil droplets making them visible and appealing
- Even illumination - no dramatic lighting changes during animation

COLOR AND SATURATION:
- Maintain original food colors throughout animation
- Boost saturation by 20-30% for appetizing appearance
- Rich vibrant colors - reds deep, greens vivid, browns warm
- Glossy surfaces on sauces and wet ingredients
- Sharp focus on all layers simultaneously

PHYSICS AND MOTION QUALITY:
- Realistic gravity-defying suspension (as if in slow-motion zero-gravity)
- Smooth ease-in-ease-out curves on all motion (no linear movement)
- Natural physics on flexible items (lettuce bends, sauce ripples)
- Slight air resistance effect - items don't rise in perfectly straight lines
- Terminal velocity - items slow down as they approach final position

TECHNICAL REQUIREMENTS:
- Duration: 8 seconds total
- Frame rate: Smooth 60fps for fluid motion
- Aspect ratio: 16:9 horizontal landscape
- High resolution maintaining sharp detail on all ingredients
- No motion blur on ingredients (clear visibility throughout)

STRICT RULES - DO NOT:
- NO camera movement AFTER 2 seconds (only forward zoom allowed in first 2 seconds)
- NO camera rotation or side-to-side movement at any time
- NO adding new ingredients not in original image
- NO removing any ingredients from the original
- NO text, logos, watermarks, or graphic overlays
- NO blue, purple, or colored smoke/steam (ONLY golden yellow particles allowed)
- NO changing food colors or appearance
- NO dramatic explosions or violent separation (smooth and controlled)
- Golden particles must be PURE GOLDEN YELLOW only (no other colors)

FINAL RESULT:
A cinematic 8-second animation with four distinct phases:
1. Fast forward zoom from medium distance to extreme close-up (0-2 sec)
2. Golden magical particles appear and orbit above the assembled food, creating a premium glow effect (2-3.2 sec), then gracefully fade out
3. Clean food deconstruction into exploded diagram view with ingredients separating into floating layers (3.2-6 sec)
4. Food reassembly where all layers smoothly move back together, reforming the complete dish (6-8 sec)

The golden particles ONLY appear during the assembled food phase (first image), creating maximum visual impact on the complete dish. The exploded view (final image) remains clean and educational without particle obstruction, clearly showing the layered ingredients. This creates a visually stunning food advertisement with Hollywood-level production quality.`
}

/**
 * 图片动态化提示词模板
 * 将静态的产品图片转换为电影级别的广告视频
 *
 * @returns 图片动态化的视频生成提示词
 *
 * @example
 * ```ts
 * const prompt = IMAGE_TO_VIDEO_PROMPT()
 * // 配合images参数使用，生成电影质感广告视频
 * ```
 */
export const IMAGE_TO_VIDEO_PROMPT = (): string => {
  return `Transform this food image into a dynamic video with these specific visual effects:

STRICT COLOR RULES FOR EFFECTS:
ONLY white steam and golden yellow particles allowed. NO blue smoke, NO purple gas, NO colored particles, NO other colored effects. Steam must be pure white. Particles must be golden yellow only.

CAMERA MOVEMENT:
First 2 seconds: Camera rapidly pushes in from medium distance to extreme close-up of the dish. Fast forward zoom motion with smooth acceleration.

Final 6 seconds: Camera orbits 360 degrees clockwise around the stationary food at close-up distance. First 180 degrees (3 seconds) - camera moves fast at 60 degrees per second circling around the dish. Final 180 degrees (3 seconds) - camera slows down to 30 degrees per second, smoothly decelerating to complete the full orbit. Food stays still in center while camera circles around it revealing all angles. Maintain sharp focus on food throughout entire rotation.

LIQUID AND BUBBLE EFFECTS (if food has sauce/soup/liquid):
Sauce or liquid gently bubbles and simmers. Small air bubbles rise from bottom to surface continuously. Liquid surface ripples and moves subtly. Oil droplets float and shimmer on liquid surface. For hot pot style dishes - visible boiling action with rapid bubbling, steam rising from liquid, ingredients slightly moving in the bubbling liquid. Sauce slowly flows and spreads. Liquid looks hot, active, and appetizing with natural physics.

STEAM EFFECTS:
Thick PURE WHITE steam only, continuously rising upward from multiple points on hot food surface. Steam billows in realistic wispy patterns. Steam moves slowly upward, spreading and dissipating naturally. Semi-transparent white vapor illuminated by warm orange light from below (steam stays white, only lighting is warm colored). Heavy white steam for hot dishes like soup, stew, hot pot. Light white steam for grilled or fried foods. NO blue steam, NO purple steam, NO colored smoke.

GOLDEN PARTICLE EFFECTS:
Hundreds of small glowing PURE GOLDEN YELLOW spheres only (like floating embers or magical sparkles) orbiting around the entire dish in circular spiral patterns. Particles move at medium-fast speed in smooth curved paths. Each particle emits bright warm GOLDEN YELLOW light with soft glow (NOT blue, NOT purple, NOT white, ONLY golden yellow). Particles leave short glowing GOLDEN light trails as they move creating streak effects. Orbital radius 20-30cm around dish center. Particles continuously spiral inward from outer edge toward dish center, merging into food surface with small bright golden flash and disappearing. New particles constantly appear at outer edge to maintain continuous flow and density. ALL particles must be golden yellow color only.

LIGHTING SETUP:
Strong warm key light from 45-degree angle above and front, creating dramatic highlights on food surface and defined shadows that enhance depth and texture. Soft orange-amber fill light from below and sides illuminating steam and particles, creating warm atmospheric glow. Subtle cool-toned edge lighting on food outline separating it from background (this is LIGHT ONLY on food edges, NOT blue smoke or gas). Background gradually darkens from medium gray to near-black creating strong contrast. Wet glossy surfaces on food reflect all light sources with bright specular highlights showing texture. Lighting creates three-dimensional depth and premium commercial food photography look. NOTE: All lighting affects surfaces only, does NOT create colored air, smoke, or particles.

LIQUID SURFACE (if applicable):
Oil and sauce surfaces shimmer and reflect warm light. Light reflects off liquid creating moving highlights and glossy appearance. Surface tension visible on droplets. Condensation on bowl edges. Liquid surface subtly ripples from bubbling underneath. Keep reflections warm-toned (golden, amber, orange) matching the lighting.

COLOR GRADING:
Boost color saturation by 30-40% to make food colors vivid and appetizing. Increase contrast between bright highlights and deep shadows for dramatic look. Set warm color temperature at 3200K giving orange-amber golden tones. Enhance specific colors - make reds vibrant and rich, yellows golden and bright, greens vivid, browns deep and rich. Keep shadows natural dark tone (NO blue or purple tint in shadows that could be mistaken for smoke). Tint highlights with warm yellow-orange for appetizing glow. Increase sharpness and clarity on food details. All color grading applies to food surface only, NOT to create colored atmospheric effects.

BACKGROUND:
Background completely out of focus with soft bokeh blur (depth of field f/2.8 or wider). Circular bokeh light orbs in amber, warm gold, and soft white scattered throughout background. Background exposure 60-70% darker than main food subject creating dramatic separation. Subtle dark vignette on frame edges directing attention to center. No distracting elements in background.

SURFACE DETAILS AND TEXTURE:
Enhance wet glossy appearance on food showing fresh just-cooked look. Small water droplets and condensation on surfaces catching light. Oil and sauce look shiny and appetizing. Increase micro-texture detail showing food grain, crispy surfaces, tender meat texture. Surface subtly shimmers and glistens as light angle changes during camera rotation. Steam droplets form and roll down on ingredients.

VIDEO TECHNICAL SPECS:
Duration: 8 seconds total
Aspect ratio: 16:9 horizontal landscape
Frame rate: Smooth 60fps motion blur for professional look
Movement: All motion smooth with ease-in/ease-out

IMPORTANT - DO NOT:
Do not add text, titles, logos, watermarks, or graphic overlays
Do not change the food items in the image
Keep the original food composition and arrangement

FOCUS ON: Dynamic motion, rich atmospheric effects, premium commercial food advertisement quality.`
}

/**
 * 模特展示视频提示词模板
 * 生成模特走路展示服装的视频，严格保持服装完整性和物理一致性
 *
 * @returns 模特展示的视频生成提示词
 *
 * @example
 * ```ts
 * const prompt = MODEL_SHOWCASE_VIDEO_PROMPT()
 * // 配合服装图片使用，生成模特走路展示视频
 * ```
 */
export const MODEL_SHOWCASE_VIDEO_PROMPT = (): string => {
  return `Create a smooth, natural 8-second fashion model showcase video transitioning from the front-facing full-body pose (first frame) to the back-facing full-body pose (last frame). The model performs a graceful 180-degree turn to showcase the complete outfit from all angles. The EXACT clothing and styling from both images must remain perfectly consistent throughout - NO changes, additions, or removals.

ANIMATION CONCEPT:
Transform smoothly from the front-facing full-body pose to the back-facing full-body pose through a natural, elegant 180-degree rotation. The model turns slowly and gracefully in place, allowing viewers to see the complete outfit from front, sides, and back. This creates a comprehensive 360-degree showcase perfect for fashion e-commerce and lookbook presentations.

CRITICAL REQUIREMENTS - ABSOLUTE RULES:

1. FULL BODY VISIBILITY (MANDATORY - HIGHEST PRIORITY):
   - ALWAYS show the COMPLETE model from HEAD to FEET throughout the entire 8 seconds
   - The model's head, face, torso, arms, legs, and feet must ALL be visible at all times
   - NO cropping off the head, legs, or feet at any point
   - NO close-ups or detail shots - maintain full body view from 0-8 seconds
   - Camera framing MUST include the complete figure (head to feet) in every single frame
   - Full body must be visible even during the rotation - never crop any body part
   - The entire silhouette from head to feet stays within frame boundaries

2. CLOTHING CONSISTENCY (MANDATORY):
   - The outfit MUST remain EXACTLY as shown in both the front and back images
   - ZERO changes to clothing design, color, pattern, or style during transition
   - All garments visible in both images must stay visible throughout the video
   - NO adding new clothing items not present in the original images
   - NO removing any clothing items shown in the original images
   - NO changing fabric patterns, colors, or textures
   - The same exact outfit from start (0s) to finish (8s)

3. ACCESSORIES CONSISTENCY (MANDATORY):
   - ALL accessories (bags, jewelry, scarves, hats, belts, etc.) MUST remain in their original positions
   - Handbags, purses, or bags MUST stay firmly held or worn - they CANNOT fall, drop, or disappear
   - Jewelry must stay in place - no falling earrings, necklaces, or bracelets
   - Scarves, belts, and other accessories must maintain their original arrangement
   - Physical consistency: accessories obey gravity and stay attached throughout the turn

VIDEO ORIENTATION:
- VERTICAL 9:16 portrait format (1080x1920 pixels)
- Optimized for mobile viewing and social media platforms
- Perfect for full-body fashion showcase in vertical frame
- Model fills the vertical frame naturally from head to feet
- Vertical framing captures complete figure from head to feet

8-SECOND VIDEO STRUCTURE - SMOOTH ROTATION SHOWCASE:

PHASE 1 - Front View Hold (0-1 seconds):
- Model starts in the EXACT pose from the front-facing image (first frame)
- Standing still, full body visible from head to feet
- Natural, confident posture matching the first frame exactly
- Camera stationary, wide shot capturing complete figure
- 9:16 vertical frame showing full body from head to feet
- Model centered in frame, facing directly toward camera
- Brief pause to establish the front view clearly

PHASE 2 - Smooth Turn Begin (1-2 seconds):
- Model begins slow, graceful rotation to the right (clockwise)
- Turn speed: very slow and elegant, not rushed
- Full body remains visible from head to feet during turn
- Arms stay relaxed at sides or in natural pose
- Posture remains upright and confident
- Camera stays stationary and fixed on wide full-body shot
- All accessories stay in place during rotation start
- Fabric begins to move naturally with the rotation

PHASE 3 - Side Profile (2-4 seconds):
- Model continues smooth rotation, passing through side profile views
- First showing right side profile (around 2-3 seconds)
- Then transitioning toward back view (around 3-4 seconds)
- COMPLETE full body visible from head to feet throughout
- Natural fabric movement as clothing flows with the turn
- All accessories remain securely in place
- Rotation speed: consistent, smooth, elegant
- Camera maintains wide full-body framing
- No sudden movements or speed changes

PHASE 4 - Continue Rotation (4-6 seconds):
- Model continues smooth rotation toward back-facing position
- Graceful, continuous motion without pausing
- Left side profile becomes briefly visible
- Full body (head to feet) remains in frame at all times
- Clothing moves naturally with rotation
- Accessories stay firmly in place
- Smooth, elegant turn continues at consistent speed

PHASE 5 - Back View Transition (6-7 seconds):
- Model approaches the back-facing position
- Rotation slows slightly as approaching final pose
- Back view becomes fully visible
- All clothing details on the back are clearly shown
- Full body from head to feet remains visible
- Natural deceleration toward final pose
- Smooth ease-out motion

PHASE 6 - Back View Hold (7-8 seconds):
- Model settles into EXACT pose from the back-facing image (last frame)
- Standing still, full body visible from head to feet
- Back view fully established, matching the last frame exactly
- Camera remains stationary, wide shot capturing complete figure
- Model centered in frame, facing directly away from camera
- Brief hold on final back view to clearly show back details
- Natural, confident posture matching the last frame

CAMERA SETUP:
- STATIONARY camera throughout entire video - NO camera movement
- Wide full-body shot maintained from 0-8 seconds
- 9:16 VERTICAL portrait orientation
- Camera positioned at model's chest/shoulder height for natural perspective
- Model always centered or slightly off-center in frame
- Framing includes complete figure from head to feet with comfortable margins
- NO zoom in, NO zoom out, NO panning - camera stays fixed
- Professional studio camera setup with locked-off tripod
- Vertical framing perfectly captures model from head to feet throughout

MODEL PERFORMANCE REQUIREMENTS:
- Smooth, graceful 180-degree rotation in place (clockwise turn to the right)
- Natural, confident posture throughout the turn
- Turn speed: slow and elegant (taking full 6 seconds for the 180° rotation)
- Arms remain relaxed at sides or in natural poses during turn
- Head turns naturally with body, maintaining upright position
- If holding accessories (bags, etc.), maintain firm, natural grip throughout rotation
- Facial expression: natural, relaxed, slight smile or neutral
- Body language: confident but natural, graceful
- Weight shifts naturally during turn for balance
- Rotation is continuous and smooth - no abrupt stops or jerky movements

ROTATION MECHANICS:
- Model rotates on central axis (turning in place, not walking)
- 180-degree rotation total: from front-facing to back-facing
- Rotation direction: clockwise (turning to the model's right)
- Smooth, constant rotation speed for first 6 seconds
- Slight deceleration in final 1 second as settling into back pose
- Model's feet stay relatively in same position (minimal footwork)
- Upper body, torso, and head rotate together naturally
- Natural weight distribution during turn

LIGHTING SETUP:
- Even, professional studio lighting throughout
- Soft, flattering light that shows clothing clearly from all angles
- NO harsh shadows or dramatic lighting
- True-to-life color reproduction - no color shifts during rotation
- Bright enough to show all garment details on front, sides, and back
- Consistent lighting as model rotates - no dark sides
- Three-point lighting or equivalent for even illumination

BACKGROUND AND ENVIRONMENT:
- Simple, clean background - neutral studio setting
- NO distracting elements, patterns, or busy backgrounds
- Plain white, light gray, or soft beige studio backdrop
- Focus 100% on the model and clothing
- Background remains consistent and clean throughout rotation
- Professional studio environment

PHYSICAL CONSISTENCY RULES:
- Gravity applies naturally - fabric drapes and flows realistically during rotation
- Accessories stay in place throughout the turn
- NO objects floating, falling unexpectedly, or defying physics
- Clothing moves naturally with rotation (fabric sways, flows naturally)
- Bags, purses, and handheld items remain firmly held during turn
- Jewelry stays attached and doesn't fall off
- Natural fabric movement during rotation - not exaggerated, not frozen
- Hair moves naturally with turn if there's any motion

COLOR AND QUALITY:
- EXACT color matching to both the front and back reference images
- High resolution with sharp details throughout
- Natural color grading - clean and realistic
- NO filters that alter the original colors
- True-to-life fabric appearance
- Clothing looks exactly as it does in both uploaded images
- Colors remain consistent during rotation (no lighting color shifts)

TECHNICAL SPECIFICATIONS:
- Duration: exactly 8 seconds
- Aspect Ratio: 9:16 VERTICAL portrait format (NOT 16:9 horizontal)
- Resolution: 1080x1920 pixels (vertical mobile format)
- Frame rate: 24-30fps for smooth, elegant motion
- High resolution maintaining sharp detail throughout
- Consistent exposure and white balance
- Professional depth of field with model in sharp focus
- Optimized for mobile viewing, social media platforms, and fashion showcases

STRICT RULES - ABSOLUTELY DO NOT:
- ❌ DO NOT change any aspect of the clothing or accessories
- ❌ DO NOT add new clothing items not in the original images
- ❌ DO NOT remove any clothing items shown in the original images
- ❌ DO NOT let accessories fall, drop, or disappear during the turn
- ❌ DO NOT crop off the model's head, legs, or feet - show full body at all times
- ❌ DO NOT alter colors, patterns, or fabric textures
- ❌ DO NOT show the outfit transforming or changing
- ❌ DO NOT use dramatic, unrealistic, or exaggerated movements
- ❌ DO NOT add text, logos, or graphic overlays
- ❌ DO NOT use overly artistic or stylized effects
- ❌ DO NOT move the camera - keep it stationary throughout
- ❌ DO NOT zoom in to close-ups or detail shots - maintain full body view always
- ❌ DO NOT rush the rotation - keep it slow and elegant
- ❌ DO NOT make the model walk or move from the spot - turn in place only
- ❌ DO NOT use horizontal 16:9 format - MUST be vertical 9:16

FINAL RESULT:
A smooth, elegant 8-second VERTICAL (9:16) fashion showcase video showing a graceful 180-degree rotation from front view to back view. The model turns slowly and naturally in place, displaying the EXACT outfit from both reference images with perfect consistency throughout. The complete figure (head to feet) is visible in every single frame of the video - never cropped. The outfit remains exactly as shown in both the front and back images - no changes, no additions, no removals. All accessories stay firmly in place during the turn. The vertical portrait format (9:16) is perfect for mobile viewing, social media platforms (Instagram Reels, TikTok, Douyin, Kuaishou, Xiaohongshu), fashion e-commerce mobile pages, and short-video fashion showcases, providing a comprehensive 360-degree view of the outfit in a single smooth rotation optimized for vertical mobile screens.`
}

/**
 * 验证品类输入
 *
 * @param category - 用户输入的品类
 * @returns 验证结果对象
 */
export const validateCategory = (category: string): {
  valid: boolean
  error?: string
} => {
  // 移除首尾空格
  const trimmed = category.trim()

  // 非空校验
  if (!trimmed) {
    return {
      valid: false,
      error: '请输入店铺经营品类'
    }
  }

  // 长度校验：2-50字符
  if (trimmed.length < 2) {
    return {
      valid: false,
      error: '品类名称至少需要2个字符'
    }
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: '品类名称不能超过50个字符'
    }
  }

  // 特殊字符过滤（只允许中文、英文、数字和常见标点）
  const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s，。、；：！？""''（）\[\]]+$/
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: '品类名称包含不支持的特殊字符'
    }
  }

  return {
    valid: true
  }
}

/**
 * 云雾 Veo API 配置常量
 */
export const VEO_API_CONFIG = {
  baseURL: 'http://yunwu.ai/v1',
  endpoint: '/video/create',
  apiKey: 'sk-pyU25kNmML4GBHQWsDhEMAuBOjQ3iEShcO7K2fP9z69H2zlv',
  model: 'veo3.1',  // Google Veo 3.1 模型（支持音频生成）
  timeout: 300000 // 5分钟超时
} as const

/**
 * 视频规格要求
 */
export const VIDEO_SPECS = {
  format: 'MP4',
  aspectRatio: '16:9',  // Veo 使用宽高比（16:9 横屏）
  enhancePrompt: true,  // 自动将中文转英文
  enableUpsample: false, // 是否启用超采样（提高质量但更贵）
  maxFileSize: 50 * 1024 * 1024 // 50MB
} as const
