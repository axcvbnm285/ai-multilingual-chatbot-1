import pygame

def play_audio(file_path):
    try:
        pygame.mixer.init()
        pygame.mixer.music.load(file_path)
        pygame.mixer.music.play()

        clock = pygame.time.Clock()
        while pygame.mixer.music.get_busy():
            clock.tick(10)
    except pygame.error as e:
        print(f"Error playing audio: {e}")
    finally:
        pygame.mixer.music.stop()
        pygame.mixer.quit()
        pygame.quit()
