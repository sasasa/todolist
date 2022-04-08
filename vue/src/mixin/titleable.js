export const Titleable = {
  created() {
    const { title, keywords, description } = this.$data
    if (title) {
      document.title = title
    }
    if (keywords) {
      document.querySelector('meta[name="keywords"]').setAttribute('content', keywords)
    }
    if (description) {
      document.querySelector('meta[name="description"]').setAttribute('content', description)
    }
  },
}