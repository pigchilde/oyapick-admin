<template>
	<el-popover
		:ref="setRefs('popover')"
		placement="top"
		:width="515"
		trigger="click"
		popper-class="tools-emoji__popover"
	>
		<template #reference>
			<slot></slot>
		</template>

		<div class="tools-emoji">
			<div class="item" v-for="item in list" :key="item" @click="check(item)">
				<img :src="getEmoji(item)" />
			</div>
		</div>
	</el-popover>
</template>

<script lang="ts" name="tools-emoji" setup>
import { useCool } from "/@/cool";
import { useSocket } from "../../hooks";
import { getEmoji } from "../../utils";

const { refs, setRefs } = useCool();
const socket = useSocket();

// 列表
const list = [
	"angry-face.png",
	"anguished-face.png",
	"astonished-face.png",
	"confounded-face.png",
	"confused-face.png",
	"crying-face.png",
	"disappointed-but-relieved-face.png",
	"disappointed-face.png",
	"dizzy-face.png",
	"drooling-face.png",
	"expressionless-face.png",
	"face-savouring-delicious-food.png",
	"face-screaming-in-fear.png",
	"face-throwing-a-kiss.png",
	"face-with-cold-sweat.png",
	"face-with-cowboy-hat.png",
	"face-with-finger-covering-closed-lips.png",
	"face-with-head-bandage.png",
	"face-with-look-of-triumph.png",
	"face-with-medical-mask.png",
	"face-with-monocle.png",
	"face-with-one-eyebrow-raised.png",
	"face-with-open-mouth-and-cold-sweat.png",
	"face-with-open-mouth-vomiting.png",
	"face-with-open-mouth.png",
	"face-with-party-horn-and-party-hat.png",
	"face-with-pleading-eyes.png",
	"face-with-rolling-eyes.png",
	"face-with-stuck-out-tongue-and-tightly-closed-eyes.png",
	"face-with-stuck-out-tongue-and-winking-eye.png",
	"face-with-stuck-out-tongue.png",
	"face-with-thermometer.png",
	"face-with-uneven-eyes-and-wavy-mouth.png",
	"face-without-mouth.png",
	"fearful-face.png",
	"flushed-face.png",
	"freezing-face.png",
	"frowning-face-with-open-mouth.png",
	"grimacing-face.png",
	"grinning-face-with-one-large-and-one-small-eye.png",
	"grinning-face-with-smiling-eyes.png",
	"grinning-face-with-star-eyes.png",
	"grinning-face.png",
	"hugging-face.png",
	"hushed-face.png",
	"imp.png",
	"kissing-face-with-closed-eyes.png",
	"kissing-face-with-smiling-eyes.png",
	"kissing-face.png",
	"loudly-crying-face.png",
	"lying-face.png",
	"money-mouth-face.png",
	"nauseated-face.png",
	"nerd-face.png",
	"neutral-face.png",
	"overheated-face.png",
	"pensive-face.png",
	"persevering-face.png",
	"pouting-face.png",
	"relieved-face.png",
	"rolling-on-the-floor-laughing.png",
	"serious-face-with-symbols-covering-mouth.png",
	"shocked-face-with-exploding-head.png",
	"sleeping-face.png",
	"sleepy-face.png",
	"slightly-frowning-face.png",
	"slightly-smiling-face.png",
	"smiling-face-with-halo.png",
	"smiling-face-with-heart-shaped-eyes.png",
	"smiling-face-with-horns.png",
	"smiling-face-with-open-mouth-and-smiling-eyes.png",
	"smiling-face-with-open-mouth-and-tightly-closed-eyes.png",
	"smiling-face-with-open-mouth.png",
	"smiling-face-with-smiling-eyes-and-hand-covering-mouth.png",
	"smiling-face-with-smiling-eyes-and-three-hearts.png",
	"smiling-face-with-smiling-eyes.png",
	"smiling-face-with-sunglasses.png",
	"smirking-face.png",
	"sneezing-face.png",
	"thinking-face.png",
	"tired-face.png",
	"upside-down-face.png",
	"weary-face.png",
	"white-frowning-face.png",
	"white-smiling-face.png",
	"winking-face.png",
	"worried-face.png",
	"zipper-mouth-face.png"
];

// 监听改变
function check(val: string) {
	socket.send({
		type: "emoji",
		data: val
	});

	refs.popover.hide();
}
</script>

<style lang="scss">
.tools-emoji__popover {
	max-width: calc(100% - 10px);
}
</style>

<style lang="scss" scoped>
.tools-emoji {
	display: flex;
	flex-wrap: wrap;
	padding-left: 5px;

	.item {
		height: 40px;
		width: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		img {
			height: 20px;
		}

		&:hover {
			background-color: #f7f7f7;
			border-radius: 4px;
		}
	}
}
</style>
