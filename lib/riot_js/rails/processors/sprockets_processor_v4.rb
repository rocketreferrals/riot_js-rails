module RiotJs
  module Rails
    class SprocketsProcessor
      def self.instance
        @instance ||= new
      end

      def self.call(input)
        instance.call(input)
      end

      def call(input)
        prepare(input)
        data = process

        @context.metadata.merge(data: data)
      end

      def self.register_self(config)
        config.assets.configure do |env|
          env.register_mime_type 'text/javascript', extensions: ['.tag'], charset: :js
          env.register_preprocessor 'text/javascript', self
        end
      end

      private

      def process
        raise 'Not implemented'
      end

      def prepare(input)
        @context = input[:environment].context_class.new(input)
        @data = input[:data]
      end

    end
  end
end
