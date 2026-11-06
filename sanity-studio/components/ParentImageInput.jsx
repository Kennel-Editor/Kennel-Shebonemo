import {PatchEvent, set} from 'sanity'

// Opt into toggle-driven image selection only after an explicit editor action.
// Opening or saving an older litter must never change its public images.
export default function ParentImageInput(props) {
  const onChange = (event) => {
    const patches = PatchEvent.from(event).patches
    const changedToggle = patches.some((patch) =>
      patch.path?.length === 1 && patch.path[0] === 'overrideImageButton',
    )
    props.onChange(PatchEvent.from(
      changedToggle ? [...patches, set(1, ['imageSelectionVersion'])] : patches,
    ))
  }
  return props.renderDefault({...props, onChange})
}
