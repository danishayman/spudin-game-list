
BEGIN
  DELETE FROM reviews WHERE user_id = OLD.id;
  RETURN OLD;
END;
