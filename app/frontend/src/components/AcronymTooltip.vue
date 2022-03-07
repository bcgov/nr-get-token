<template>
  <v-tooltip right>
    <template #activator="{ on }">
      <v-icon v-on="on">help_outline</v-icon>
    </template>
    The Application Acronym must comply with the following format:
    <ul>
      <li>UPPERCASE LETTERS ONLY</li>
      <li>Underscores may be placed between letters</li>
      <li>Must begin and end with a letter</li>
      <li>At least {{ fieldValidations.ACRONYM_MIN_LENGTH }} characters</li>
      <li>
        Examples:
        <em>ABCD</em>,
        <em>ABCD_WXYZ</em>
      </li>
    </ul>
  </v-tooltip>
</template>

<script>
import { FieldValidations } from '@/utils/constants.js';

export default {
  name: 'AcronymTooltip',
  data() {
    return {
      fieldValidations: FieldValidations,
    };
  },
};
</script>
